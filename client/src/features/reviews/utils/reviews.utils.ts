import type { Review } from "../types/reviews.types"

/**
 * Calcula el promedio de estrellas y el total de reseñas.
 * Retorna null si no hay reseñas.
 */
export const calculateAverageRating = (reviews?: Review[]) => {
  if (!reviews || reviews.length === 0) return null

  const sum = reviews.reduce((acc, r) => acc + Number(r.rating), 0)
  const average = (sum / reviews.length).toFixed(1)

  return {
    average,
    count: reviews.length,
  }
}
