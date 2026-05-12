export type RevieweeRole = "freelancer" | "contractor"

export interface Review {
  id: string
  contractId: string
  reviewerId: string
  revieweeId: string
  revieweeRole: RevieweeRole
  rating: string | number // Viene como numeric (string) del backend
  comment: string | null
  createdAt: string
  reviewer?: {
    name: string
    image: string | null
  }
}

