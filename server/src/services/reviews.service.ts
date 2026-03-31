import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { CreateReviewData, UpdateReviewData } from "../schemas/reviews.schema"

export const createReview = async (
  userId: string,
  contractId: string,
  data: CreateReviewData,
) => {
  const contract = await db.query.contract.findFirst({
    where: eq(schema.contract.id, contractId),
    with: {
      freelancer: true,
      contractor: true,
    },
  })

  if (!contract) {
    throw new AppError("Contrato no encontrado", 404)
  }

  if (contract.status !== "completed") {
    throw new AppError(
      "El contrato debe estar completado antes de dejar una reseña",
      400,
    )
  }

  const isFreelancer = contract.freelancer?.userId === userId
  const isContractor = contract.contractor?.userId === userId

  if (!isFreelancer && !isContractor) {
    throw new AppError("No eres participante de este contrato", 403)
  }

  const revieweeId = isFreelancer
    ? contract.contractor!.userId
    : contract.freelancer!.userId

  const revieweeRole = isFreelancer ? "contractor" : "freelancer"

  const existing = await db.query.review.findFirst({
    where: and(
      eq(schema.review.contractId, contractId),
      eq(schema.review.reviewerId, userId),
    ),
  })

  if (existing) {
    throw new AppError("Ya has dejado una reseña para este contrato", 400)
  }

  const [newReview] = await db
    .insert(schema.review)
    .values({
      id: crypto.randomUUID(),
      contractId: contract.id,
      reviewerId: userId,
      revieweeId,
      revieweeRole,
      rating: data.rating,
      comment: data.comment,
    })
    .returning()

  return newReview
}

export const updateReview = async (
  userId: string,
  reviewId: string,
  data: UpdateReviewData,
) => {
  const existing = await db.query.review.findFirst({
    where: eq(schema.review.id, reviewId),
  })

  if (!existing) {
    throw new AppError("Review no encontrada", 404)
  }

  if (existing.reviewerId !== userId) {
    throw new AppError("Solo puedes editar tus propias reseñas", 403)
  }

  const [updated] = await db
    .update(schema.review)
    .set({
      ...(data.rating !== undefined && { rating: data.rating }),
      ...(data.comment !== undefined && { comment: data.comment }),
    })
    .where(eq(schema.review.id, reviewId))
    .returning()

  return updated
}
