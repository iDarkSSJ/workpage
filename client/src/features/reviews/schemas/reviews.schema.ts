import { z } from "zod"

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(400, "El comentario no puede exceder los 400 caracteres").optional(),
})

export type CreateReviewData = z.infer<typeof createReviewSchema>
