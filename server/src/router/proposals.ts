import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

const router = Router()

const createProposalSchema = z.object({
  coverLetter: z.string().min(10),
  bidAmount: z.number().or(z.string().transform(Number)),
  bidType: z.enum(["fixed", "hourly"]),
})

const updateProposalStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "withdrawn"]),
})

// Crear una nueva propuesta
// POST /proposals/project/:projectId
// ------------------
// pendiente
// ------------------

// GET /proposals/project/:projectId
// -------------------
// pendiente
// -------------------

// PATCH /proposals/:id/status
router.patch("/:id/status", requireAuth, async (req: Request, res) => {
  try {
    const { status } = updateProposalStatusSchema.parse(req.body)

    const proposal = await db.query.proposal.findFirst({
      where: eq(schema.proposal.id, req.params.id as string),
    })

    if (!proposal) {
      res.status(404).json({ error: "Propuesta no encontrada" })
      return
    }

    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, proposal.projectId),
      with: { contractor: true },
    })

    if (!project || !project.contractor) {
      res.status(404).json({ error: "Proyecto o contratista no encontrado" })
      return
    }

    const freelancer = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.id, proposal.freelancerId),
    })

    if (!freelancer) {
      res.status(404).json({ error: "Freelancer no encontrado" })
      return
    }

    const isContractor = project.contractor.userId === req.session!.user.id
    const isFreelancer = freelancer.userId === req.session!.user.id

    if (status === "withdrawn") {
      if (!isFreelancer) {
        res
          .status(403)
          .json({ error: "Solo el freelancer puede retirar la propuesta" })
        return
      }
    } else {
      // accepted or rejected
      if (!isContractor) {
        res.status(403).json({
          error:
            "Solo el contratista del proyecto puede aceptar o rechazar propuestas",
        })
        return
      }
    }

    if (status === "accepted") {
      // Transacción para actualizar la propuesta, el proyecto y crear el contrato
      await db.transaction(async (tx) => {
        await tx
          .update(schema.proposal)
          .set({ status: "accepted" })
          .where(eq(schema.proposal.id, proposal.id))

        await tx
          .update(schema.project)
          .set({ status: "in_progress" })
          .where(eq(schema.project.id, proposal.projectId))

        await tx.insert(schema.contract).values({
          id: crypto.randomUUID(),
          proposalId: proposal.id,
          projectId: proposal.projectId,
          contractorId: project.contractorId,
          freelancerId: proposal.freelancerId,
          agreedAmount: proposal.bidAmount,
          status: "active",
        })
      })
      res.json({
        message: "Propuesta aceptada, proyecto en progreso y contrato creado.",
      })
      return
    }

    // Actualización normal para propuesta retirada/rechazada
    const [updated] = await db
      .update(schema.proposal)
      .set({ status })
      .where(eq(schema.proposal.id, req.params.id as string))
      .returning()

    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json(error.format())
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router
