import { api } from "./api"
import type { Review, CreateReviewInput } from "../types/reviews"

// POST /api/reviews/contract/:contractId — dejar review post-contrato
export function createReview(contractId: string, data: CreateReviewInput) {
  return api.post<Review>(`/reviews/contract/${contractId}`, data)
}

// PATCH /api/reviews/:id — editar propia review
export function updateReview(id: string, data: CreateReviewInput) {
  return api.patch<Review>(`/reviews/${id}`, data)
}
