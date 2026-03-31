import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { CreateProposalData } from "../schemas/proposals.schema"

export const createProposal = async (userId: string, projectId: string, data: CreateProposalData) => {
  const freelancer = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.userId, userId),
  })

  if (!freelancer) {
    throw new AppError("Debes crear un perfil de freelancer primero", 403)
  }

  const project = await db.query.project.findFirst({
    where: eq(schema.project.id, projectId),
  })

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404)
  }

  if (project.status !== "open") {
    throw new AppError("El proyecto ya no está abierto para propuestas", 400)
  }

  const existing = await db.query.proposal.findFirst({
    where: and(
      eq(schema.proposal.projectId, projectId),
      eq(schema.proposal.freelancerId, freelancer.id)
    ),
  })

  if (existing) {
    throw new AppError("Ya has enviado una propuesta para este proyecto", 400)
  }

  const [newProposal] = await db
    .insert(schema.proposal)
    .values({
      id: crypto.randomUUID(),
      projectId,
      freelancerId: freelancer.id,
      status: "pending",
      bidAmount: data.bidAmount,
      bidType: data.bidType,
      coverLetter: data.coverLetter,
    })
    .returning()

  return newProposal
}

export const getProposalsByProjectId = async (userId: string, projectId: string) => {
  const project = await db.query.project.findFirst({
    where: eq(schema.project.id, projectId),
    with: { contractor: true },
  })

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404)
  }

  if (project.contractor.userId !== userId) {
    throw new AppError("No tienes permiso para ver las propuestas de este proyecto", 403)
  }

  const proposals = await db.query.proposal.findMany({
    where: eq(schema.proposal.projectId, projectId),
    with: {
      freelancer: {
        with: { user: { columns: { name: true, image: true, id: true } } },
      },
    },
  })

  return proposals
}

export const updateProposalStatus = async (userId: string, proposalId: string, status: string) => {
  const proposal = await db.query.proposal.findFirst({
    where: eq(schema.proposal.id, proposalId),
  })

  if (!proposal) {
    throw new AppError("Propuesta no encontrada", 404)
  }

  const project = await db.query.project.findFirst({
    where: eq(schema.project.id, proposal.projectId),
    with: { contractor: true },
  })

  if (!project || !project.contractor) {
    throw new AppError("Proyecto o contratista no encontrado", 404)
  }

  const freelancer = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.id, proposal.freelancerId),
  })

  if (!freelancer) {
    throw new AppError("Freelancer no encontrado", 404)
  }

  const isContractor = project.contractor.userId === userId
  const isFreelancer = freelancer.userId === userId

  if (status === "withdrawn") {
    if (!isFreelancer) {
      throw new AppError("Solo el freelancer puede retirar la propuesta", 403)
    }
  } else {
    if (!isContractor) {
      throw new AppError("Solo el contratista del proyecto puede aceptar o rechazar propuestas", 403)
    }
  }

  // si se acepta la propuesta, se crea un contrato y se cambia el estado del proyecto a "in_progress"
  if (status === "accepted") {
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

    return { message: "Propuesta aceptada, proyecto en progreso y contrato creado." }
  }

  const [updated] = await db
    .update(schema.proposal)
    .set({ status })
    .where(eq(schema.proposal.id, proposalId))
    .returning()

  return updated
}