import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { ExperienceData } from "../schemas/profile.schema"
import { getFreelancerId } from "../utils/services"

// LOS DATOS YA VIENEN VALIDADOS. Y CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

export const createExperiences = async (
  userId: string,
  items: ExperienceData[],
) => {
  const freelancerId = await getFreelancerId(userId)

  return db
    .insert(schema.freelancerExperience)
    .values(
      items.map((exp) => ({
        ...exp,
        id: crypto.randomUUID(),
        freelancerId,
      })),
    )
    .returning()
}

export const deleteExperience = async (
  userId: string,
  experienceId: string,
) => {
  const freelancerId = await getFreelancerId(userId)

  const deleted = await db
    .delete(schema.freelancerExperience)
    .where(
      and(
        eq(schema.freelancerExperience.id, experienceId),
        eq(schema.freelancerExperience.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (deleted.length === 0) throw new AppError("Experiencia no encontrada", 404)
  return { success: true }
}

export const updateExperience = async (
  userId: string,
  experienceId: string,
  data: ExperienceData,
) => {
  const freelancerId = await getFreelancerId(userId)

  const [updated] = await db
    .update(schema.freelancerExperience)
    .set(data)
    .where(
      and(
        eq(schema.freelancerExperience.id, experienceId),
        eq(schema.freelancerExperience.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (!updated)
    throw new AppError("Experiencia no encontrada o no autorizada", 404)
  return updated
}
