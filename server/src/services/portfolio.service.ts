import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { PortfolioData } from "../schemas/profile.schema"
import { getFreelancerId } from "../utils/services"

// LOS DATOS YA VIENEN VALIDADOS. Y CUALQUIER ERROR QUE SEA LANZADO EN SERVICES O EN CONTROLLERS SERA INTERCEPTADO POR EL MIDDLEWARE DE ERRORES

export const createPortfolioItems = async (
  userId: string,
  items: PortfolioData[],
) => {
  const freelancerId = await getFreelancerId(userId)

  const inserted = await db
    .insert(schema.freelancerPortfolio)
    .values(
      items.map((port) => ({
        id: crypto.randomUUID(),
        freelancerId,
        ...port,
      })),
    )
    .returning()

  return inserted
}

export const deletePortfolioItem = async (
  userId: string,
  portfolioId: string,
) => {
  const freelancerId = await getFreelancerId(userId)

  const deleted = await db
    .delete(schema.freelancerPortfolio)
    .where(
      and(
        eq(schema.freelancerPortfolio.id, portfolioId),
        eq(schema.freelancerPortfolio.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (deleted.length === 0) {
    throw new AppError("Proyecto no encontrado", 404)
  }

  return { success: true }
}

export const updatePortfolioItem = async (
  userId: string,
  portfolioId: string,
  data: PortfolioData,
) => {
  const freelancerId = await getFreelancerId(userId)

  const updated = await db
    .update(schema.freelancerPortfolio)
    .set(data)
    .where(
      and(
        eq(schema.freelancerPortfolio.id, portfolioId),
        eq(schema.freelancerPortfolio.freelancerId, freelancerId),
      ),
    )
    .returning()

  if (updated.length === 0) {
    throw new AppError("Proyecto no encontrado o no autorizado", 404)
  }

  return updated[0]
}
