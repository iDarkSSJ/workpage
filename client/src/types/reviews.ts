export interface Review {
  id: string
  contractId: string
  reviewerId: string
  revieweeId: string
  revieweeRole: "freelancer" | "contractor"
  rating: string // numeric viene como string
  comment: string | null
  createdAt: string
  // relaciones opcionales
  reviewer?: { name: string; image: string | null }
  reviewee?: { name: string; image: string | null }
}

export type CreateReviewInput = {
  rating: number
  comment?: string
}
