import Card from "../Card"
import { Star } from "lucide-react"
import type { Review } from "../../types/reviews"

export default function FreelancerReviewsSection({ reviews }: { reviews: Review[] }) {
  if (!reviews || reviews.length === 0) return null

  return (
    <Card className="w-full">
      <h2 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <Star size={16} className="text-primary" />
        Reseñas ({reviews.length})
      </h2>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-zinc-700/40 pb-4 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-zinc-300">
                {review.reviewer?.name ?? "Usuario"}
              </span>
              <span className="flex items-center gap-1 text-amber-400 text-sm font-semibold">
                <Star size={12} fill="currentColor" />
                {review.rating}
              </span>
            </div>
            {review.comment && (
              <p className="text-sm text-zinc-400">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
