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
router.post("/project/:projectId", requireAuth, async (req: Request, res) => {
  try {
    const parsed = createProposalSchema.parse(req.body)

    // Obtener el perfil del freelancer
    const freelancer = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.userId, req.session!.user.id),
    })

    if (!freelancer) {
      res
        .status(403)
        .json({ error: "Debes crear un perfil de freelancer primero" })
      return
    }

    // Verificar que el proyecto exista
    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, req.params.projectId as string),
    })

    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" })
      return
    }

    if (project.status !== "open") {
      res
        .status(400)
        .json({ error: "El proyecto ya no está abierto para propuestas" })
      return
    }

    // Verificar que no exista una propuesta previa del mismo freelancer
    const existing = await db.query.proposal.findFirst({
      where: and(
        eq(schema.proposal.projectId, req.params.projectId as string),
        eq(schema.proposal.freelancerId, freelancer.id),
      ),
    })

    if (existing) {
      res.status(400).json({
        error: "Ya has enviado una propuesta para este proyecto",
      })
      return
    }

    const [newProposal] = await db
      .insert(schema.proposal)
      .values({
        id: crypto.randomUUID(),
        projectId: req.params.projectId as string,
        freelancerId: freelancer.id,
        coverLetter: parsed.coverLetter,
        bidAmount: String(parsed.bidAmount),
        bidType: parsed.bidType,
        status: "pending",
      })
      .returning()

    res.status(201).json(newProposal)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Error validando los datos de la propuesta" })
      return
    }
    res.status(500).json({ error: "Error al crear la propuesta" })
  }
})

// GET /proposals/project/:projectId
router.get("/project/:projectId", requireAuth, async (req: Request, res) => {
  try {
    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, req.params.projectId as string),
      with: { contractor: true },
    })

    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" })
      return
    }

    // Verificar que el usuario sea el dueño del proyecto
    if (project.contractor.userId !== req.session!.user.id) {
      res
        .status(403)
        .json({
          error: "No tienes permiso para ver las propuestas de este proyecto",
        })
      return
    }

    const proposals = await db.query.proposal.findMany({
      where: eq(schema.proposal.projectId, req.params.projectId as string),
      with: {
        freelancer: {
          with: { user: { columns: { name: true, image: true } } },
        },
      },
    })

    res.json(proposals)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las propuestas" })
  }
})

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
