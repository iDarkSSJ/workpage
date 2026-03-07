import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, or } from "drizzle-orm"

const router = Router()

// GET /contracts
// Obtiene todos los contratos del usuario logueado
// Tanto de su perfil como freelancer como contractor
router.get("/", requireAuth, async (req: Request, res) => {
  try {
    const userId = req.session!.user.id

    const freelancer = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.userId, userId),
    })

    const contractor = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.userId, userId),
    })

    const withOptions = {
      project: true,
      freelancer: {
        with: { user: { columns: { name: true, image: true } } },
      },
      contractor: {
        with: { user: { columns: { name: true, image: true } } },
      },
    } as const

    let asFreelancer = []
    let asContractor = []

    if (freelancer?.id) {
      asFreelancer = await db.query.contract.findMany({
        where: eq(schema.contract.freelancerId, freelancer.id),
        with: withOptions,
        orderBy: (contracts, { desc }) => [desc(contracts.startedAt)],
      })
    }

    if (contractor?.id) {
      asContractor = await db.query.contract.findMany({
        where: eq(schema.contract.contractorId, contractor.id),
        with: withOptions,
        orderBy: (contracts, { desc }) => [desc(contracts.startedAt)],
      })
    }

    res.json({
      asFreelancer,
      asContractor,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener los contratos" })
  }
})


// PATCH /contracts/:id/complete
// endpoint protegido con middleware
// solo el contratista puede completar el contrato
router.patch("/:id/complete", requireAuth, async (req: Request, res) => {
  try {
    const contractRecord = await db.query.contract.findFirst({
      where: eq(schema.contract.id, req.params.id as string),
    })

    if (!contractRecord) {
      res.status(404).json({ error: "Contrato no encontrado" })
      return
    }

    const contractorProfile = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.id, contractRecord.contractorId),
    })

    if (!contractorProfile) {
      res.status(404).json({ error: "Perfil de contratista no encontrado" })
      return
    }

    const isContractor = contractorProfile.userId === req.session!.user.id

    if (contractRecord.status === "completed") {
      res.status(400).json({ error: "El contrato ya esta completado" })
      return
    }

    if (!isContractor) {
      res.status(403).json({
        error: "Solo el contratista puede marcar el contrato como completado",
      })
      return
    }

    const [updatedContract] = await db
      .update(schema.contract)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(schema.contract.id, req.params.id as string))
      .returning()

    // Solo actualizamos el estado del contrato a completado
    // Es decision del contratante si el proyecto esta completado o no en caso de que el proyecto tenga mas de un contrato con varios freelancers.
    await db
      .update(schema.project)
      .set({ status: "completed" })
      .where(eq(schema.project.id, contractRecord.projectId))

    res.json(updatedContract)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router
