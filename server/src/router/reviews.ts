import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

const router = Router()

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5).or(z.string().transform(Number)),
  comment: z.string().optional(),
})

// POST /contract/:contractId
router.post("/contract/:contractId", requireAuth, async (req: Request, res) => {
  try {
    const parsed = createReviewSchema.parse(req.body)

    const contract = await db.query.contract.findFirst({
      where: eq(schema.contract.id, req.params.contractId as string),
      with: {
        freelancer: true,
        contractor: true,
      },
    })

    if (!contract) {
      res.status(404).json({ error: "Contrato no encontrado" })
      return
    }

    if (contract.status !== "completed") {
      res.status(400).json({
        error: "El contrato debe estar completado antes de dejar una reseña",
      })
      return
    }

    const isFreelancer = contract.freelancer!.userId === req.session!.user.id
    const isContractor = contract.contractor!.userId === req.session!.user.id

    if (!isFreelancer && !isContractor) {
      res.status(403).json({ error: "No eres participante de este contrato" })
      return
    }

    // Reviewee es el participante que esta siendo evaluado
    // Reviewer es el participante que esta evaluando
    // por lo tanto si el que esta creando la review es freelancer, el reviewee es el contratista
    // y si el que esta creando la review es contratista, el reviewee es el freelancer
    // para que se entienda :> -jose luis

    const revieweeId = isFreelancer
      ? contract.contractor!.userId
      : contract.freelancer!.userId

    // Rol con el que el reviewee participó en el contrato
    const revieweeRole = isFreelancer ? "contractor" : "freelancer"

    const existing = await db.query.review.findFirst({
      where: and(
        eq(schema.review.contractId, contract.id),
        eq(schema.review.reviewerId, req.session!.user.id),
      ),
    })

    if (existing) {
      res
        .status(400)
        .json({ error: "Ya has dejado una reseña para este contrato" })
      return
    }

    const [newReview] = await db
      .insert(schema.review)
      .values({
        id: crypto.randomUUID(),
        contractId: contract.id,
        reviewerId: req.session!.user.id,
        revieweeId,
        revieweeRole,
        rating: String(parsed.rating),
        comment: parsed.comment,
      })
      .returning()

    res.status(201).json(newReview)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// PATCH /:id — editar una review propia
router.patch("/:id", requireAuth, async (req: Request, res) => {
  try {
    const parsed = createReviewSchema.partial().parse(req.body)

    const existing = await db.query.review.findFirst({
      where: eq(schema.review.id, req.params.id as string),
    })

    if (!existing) {
      res.status(404).json({ error: "Review no encontrada" })
      return
    }

    if (existing.reviewerId !== req.session!.user.id) {
      res.status(403).json({ error: "Solo puedes editar tus propias reseñas" })
      return
    }

    const [updated] = await db
      .update(schema.review)
      .set({
        ...(parsed.rating !== undefined && { rating: String(parsed.rating) }),
        ...(parsed.comment !== undefined && { comment: parsed.comment }),
      })
      .where(eq(schema.review.id, req.params.id as string))
      .returning()

    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router
