import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and, count, asc, desc } from "drizzle-orm"
import crypto from "crypto"
import { ContractorProfileData } from "../schemas/profile.schema"
import { AppError } from "../utils/AppError"

// LOS DATOS YA VIENEN VALIDADOS. Y CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// para obtener el perfil de contractor PROPIO
export const getMyContractorProfile = async (userId: string) => {
  return db.query.contractorProfile.findFirst({
    where: eq(schema.contractorProfile.userId, userId),
  })
}

// para obtener el perfil de contractor por contractor_id (ruta publica)
export const getContractorProfileById = async (id: string) => {
  const profile = await db.query.contractorProfile.findFirst({
    where: eq(schema.contractorProfile.id, id),
    with: {
      user: { columns: { name: true, image: true } },
    },
  })

  if (!profile) return null

  const reviews = await db.query.review.findMany({
    where: and(
      eq(schema.review.revieweeId, profile.userId),
      eq(schema.review.revieweeRole, "contractor"),
    ),
    with: {
      reviewer: { columns: { name: true, image: true } },
    },
  })

  return { ...profile, reviews }
}

export const createContractorProfile = async (
  userId: string,
  data: ContractorProfileData,
) => {
  const existing = await db.query.contractorProfile.findFirst({
    where: eq(schema.contractorProfile.userId, userId),
  })

  if (existing) throw new AppError("Ya existe un perfil de contractor.", 400)

  const [newProfile] = await db
    .insert(schema.contractorProfile)
    .values({ id: crypto.randomUUID(), userId, ...data })
    .returning()

  return newProfile
}

export const updateContractorProfile = async (
  userId: string,
  data: ContractorProfileData,
) => {
  const [updatedProfile] = await db
    .update(schema.contractorProfile)
    .set(data)
    .where(eq(schema.contractorProfile.userId, userId))
    .returning()

  if (!updatedProfile) {
    throw new AppError("No existe un perfil de contractor.", 404)
  }

  return updatedProfile
}

export const getContractorProjects = async (
  contractorId: string,
  status?: string,
  orderBy: "createdAt" | "updatedAt" = "createdAt",
  order: "asc" | "desc" = "desc",
) => {
  const results = await db
    .select({
      project: schema.project,
      proposalCount: count(schema.proposal.id),
    })
    .from(schema.project)
    .leftJoin(schema.proposal, eq(schema.project.id, schema.proposal.projectId))
    .where(
      and(
        eq(schema.project.contractorId, contractorId),
        status ? eq(schema.project.status, status) : undefined,
      ),
    )
    .groupBy(schema.project.id)
    .orderBy(
      order === "desc"
        ? desc(schema.project[orderBy])
        : asc(schema.project[orderBy]),
    )

  return results.map((r) => ({
    ...r.project,
    proposalCount: r.proposalCount,
  }))
}
