import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { CertificationData } from "../schemas/profile.schema"
import { getFreelancerId } from "../utils/services"

// LOS DATOS YA VIENEN VALIDADOS. Y CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

export const createCertifications = async (userId: string, items: CertificationData[]) => {
  const freelancerId = await getFreelancerId(userId)

  const inserted = await db
    .insert(schema.freelancerCertification)
    .values(
      items.map((cert) => ({
        ...cert,
        id: crypto.randomUUID(),
        freelancerId,
      })),
    )
    .returning()

  return inserted
}

export const deleteCertification = async (userId: string, certId: string) => {
  const freelancerId = await getFreelancerId(userId)

  const deleted = await db
    .delete(schema.freelancerCertification)
    .where(
      and(
        eq(schema.freelancerCertification.id, certId),
        eq(schema.freelancerCertification.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (deleted.length === 0) {
    throw new AppError("Certificación no encontrada", 404)
  }

  return { success: true }
}

export const updateCertification = async (userId: string, certId: string, data: CertificationData) => {
  const freelancerId = await getFreelancerId(userId)

  const updated = await db
    .update(schema.freelancerCertification)
    .set(data)
    .where(
      and(
        eq(schema.freelancerCertification.id, certId),
        eq(schema.freelancerCertification.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (updated.length === 0) {
    throw new AppError("Certificación no encontrada o no autorizada", 404)
  }

  return updated[0]
}