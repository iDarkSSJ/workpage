import { api } from "../../../lib/api"
import type { Review } from "../types/reviews.types"
import type { CreateReviewData } from "../schemas/reviews.schema"

export const createReviewReq = (contractId: string, data: CreateReviewData) =>
  api.post<Review>(`/reviews/contract/${contractId}`, data)

export const deleteReviewReq = (id: string) =>
  api.delete<{ success: true }>(`/reviews/${id}`)

export const updateReviewReq = (id: string, data: CreateReviewData) =>
  api.put<Review>(`/reviews/${id}`, data)
