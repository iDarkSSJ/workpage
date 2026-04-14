import { z } from "zod"

export const createReviewSchema = z.object({
  rating: z.coerce.number().min(1).max(5).transform(String),
  comment: z.string().trim().max(400, "El comentario no puede exceder los 400 caracteres").optional(),
})

export const updateReviewSchema = createReviewSchema.partial()

export type CreateReviewData = z.infer<typeof createReviewSchema>
export type UpdateReviewData = z.infer<typeof updateReviewSchema>
