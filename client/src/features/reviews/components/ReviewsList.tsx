import type { Review } from "../types/reviews.types"
import ReviewItem from "./ReviewItem"
import { Star, MessageCircleOff } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"

interface Props {
  reviews: Review[]
  title?: string
}

export default function ReviewsList({
  reviews,
  title = "Valoraciones y Reseñas",
}: Props) {
  const { data: session } = useAuth()
  const currentUserId = session?.user?.id

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
      : 0

  const myReview = reviews.find((r) => r.reviewerId === currentUserId)
  const otherReviews = reviews
    .filter((r) => r.reviewerId !== currentUserId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

  const sortedReviews = myReview ? [myReview, ...otherReviews] : otherReviews

  return (
    <div className="space-y-8 py-8 border-t border-zinc-800/50 mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white leading-tight mb-2">
            {title}
          </h2>
          <p className="text-zinc-500 font-medium">
            Basado en {reviews.length}{" "}
            {reviews.length === 1 ? "opinión" : "opiniones"} de otros usuarios
          </p>
        </div>

        {reviews.length > 0 && (
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
            <div className="text-center shrink-0 border-r border-zinc-800 pr-4 mr-2">
              <p className="text-3xl font-black text-primary leading-none mb-1">
                {averageRating.toFixed(1)}
              </p>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">
                Promedio
              </p>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  fill={
                    s <= Math.round(averageRating)
                      ? "currentColor"
                      : "transparent"
                  }
                  className={
                    s <= Math.round(averageRating) ? "" : "text-zinc-700"
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
          <MessageCircleOff size={48} className="text-zinc-800 mb-4" />
          <p className="text-zinc-400 font-medium text-center">
            Aún no hay reseñas disponibles.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {sortedReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  )
}
