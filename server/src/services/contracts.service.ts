import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq } from "drizzle-orm"
import { AppError } from "../utils/AppError"

export const getMyContracts = async (userId: string) => {
  const freelancer = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.userId, userId),
  })

  const contractor = await db.query.contractorProfile.findFirst({
    where: eq(schema.contractorProfile.userId, userId),
  })

  const withOptions = {
    project: true,
    freelancer: {
      with: { user: { columns: { name: true, image: true, id: true } } },
    },
    contractor: {
      with: { user: { columns: { name: true, image: true, id: true } } },
    },
  } as const

  let asFreelancer: any[] = []
  let asContractor: any[] = []

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

  return {
    asFreelancer,
    asContractor,
  }
}

export const completeContract = async (userId: string, contractId: string) => {

  const contractRecord = await db.query.contract.findFirst({
    where: eq(schema.contract.id, contractId),
    with: { contractor: true },
  })

  if (!contractRecord) {
    throw new AppError("Contrato no encontrado", 404)
  }

  if (!contractRecord.contractor) {
    throw new AppError("Perfil de contratista no encontrado", 404)
  }

  if (contractRecord.contractor.userId !== userId) {
    throw new AppError("Solo el contratista puede marcar el contrato como completado", 403)
  }

  if (contractRecord.status === "completed") {
    throw new AppError("El contrato ya está completado", 400)
  }

  const [updatedContract] = await db.transaction(async (tx) => {
    const [updated] = await tx
      .update(schema.contract)
      .set({
        status: "completed",
        completedAt: new Date(),
      })
      .where(eq(schema.contract.id, contractId))
      .returning()

    await tx
      .update(schema.project)
      .set({ status: "completed" })
      .where(eq(schema.project.id, contractRecord.projectId))

    return [updated]
  })

  return updatedContract
}