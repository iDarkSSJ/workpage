import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq } from "drizzle-orm"

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
// -----------
// pendiente
// -----------

export default router
