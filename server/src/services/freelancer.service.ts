import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { FreelancerProfileData } from "../schemas/profile.schema"
import { AppError } from "../utils/AppError"

// LOS DATOS YA VIENEN VALIDADOS. Y CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

// para obtener el perfil de freelancer PROPIO
export const getMyFreelancerProfile = async (userId: string) => {
  return db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.userId, userId),
    with: {
      skills: { with: { skill: true } },
      experiences: true,
      certifications: true,
      portfolioItems: true,
    },
  })
}

// para obtener el perfil de freelancer por freelancer_id (ruta publica)
export const getFreelancerProfileById = async (id: string) => {
  const profile = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.id, id),
    with: {
      user: { columns: { name: true, image: true } },
      skills: { with: { skill: true } },
      experiences: true,
      certifications: true,
      portfolioItems: true,
    },
  })

  if (!profile) return null

  const reviews = await db.query.review.findMany({
    where: and(
      eq(schema.review.revieweeId, profile.userId),
      eq(schema.review.revieweeRole, "freelancer"),
    ),
    with: {
      reviewer: { columns: { name: true, image: true } },
    },
  })

  return { ...profile, reviews }
}

export const createFreelancerProfile = async (
  userId: string,
  data: Partial<FreelancerProfileData>,
) => {
  const existing = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.userId, userId),
  })

  if (existing) throw new AppError("Ya existe un perfil de freelancer.", 400)

  const { skills, ...baseProfile } = data
  const newProfileId = crypto.randomUUID()

  return db.transaction(async (tx) => {
    const [insertedProfile] = await tx
      .insert(schema.freelancerProfile)
      .values({
        id: newProfileId,
        userId,
        ...baseProfile,
      })
      .returning()

    if (skills && skills.length > 0) {
      await tx
        .insert(schema.freelancerSkill)
        .values(
          skills.map((skillId) => ({ freelancerId: newProfileId, skillId })),
        )
    }

    return insertedProfile
  })
}

export const updateFreelancerProfile = async (
  userId: string,
  data: FreelancerProfileData,
) => {
  const existing = await db.query.freelancerProfile.findFirst({
    where: eq(schema.freelancerProfile.userId, userId),
    columns: { id: true },
  })

  if (!existing) throw new AppError("No existe un perfil de freelancer.", 404)

  const { skills, ...baseProfile } = data

  return db.transaction(async (tx) => {
    const [updatedProfile] = await tx
      .update(schema.freelancerProfile)
      .set({
        ...baseProfile
      })
      .where(eq(schema.freelancerProfile.userId, userId))
      .returning()

    // borramos todos los skills de el usuario y luego insertamos los nuevos
    await tx
      .delete(schema.freelancerSkill)
      .where(eq(schema.freelancerSkill.freelancerId, existing.id))

    if (skills && skills.length > 0) {
      await tx
        .insert(schema.freelancerSkill)
        .values(
          skills.map((skillId) => ({ freelancerId: existing.id, skillId })),
        )
    }

    return updatedProfile
  })
}
