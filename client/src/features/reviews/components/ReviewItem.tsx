import { useState } from "react"
import type { Review } from "../types/reviews.types"
import StarRating from "./StarRating"
import { User, Trash2, Calendar, Pencil } from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { useDeleteReview } from "../api/useReviews"
import ReviewForm from "./ReviewForm"

interface Props {
  review: Review
}

export default function ReviewItem({ review }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const { data: session } = useAuth()
  const deleteMut = useDeleteReview()

  const isOwner = session?.user?.id === review.reviewerId
  const reviewerName = review.reviewer?.name || "Usuario"
  const reviewerImage = review.reviewer?.image

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta valoración?")) {
      deleteMut.mutate(review.id)
    }
  }

  if (isEditing) {
    return (
      <ReviewForm
        mode="edit"
        initialData={review}
        projectName="Tu Valoración"
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    )
  }

  if (deleteMut.isSuccess) {
    return null
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 group">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
            {reviewerImage ? (
              <img
                src={reviewerImage}
                alt={reviewerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} className="text-zinc-500" />
            )}
          </div>
          <div>
            <p className="text-zinc-100 font-bold leading-none mb-1">
              {reviewerName}
            </p>
            <div className="flex items-center gap-2 text-zinc-500">
              <Calendar size={12} className="shrink-0" />
              <span className="text-[11px] font-medium">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex items-center gap-1 transition-all">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 rounded-lg text-zinc-600 hover:text-primary hover:bg-primary/10 transition-all"
              title="Editar reseña">
              <Pencil size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMut.isPending}
              className="p-2 rounded-lg text-zinc-600 hover:text-danger hover:bg-danger/10 transition-all disabled:opacity-50"
              title="Eliminar reseña">
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <div className="mb-3">
        <StarRating value={Number(review.rating)} readonly showInput={false} />
      </div>

      {review.comment && (
        <p className="text-zinc-300 text-sm leading-relaxed italic">
          "{review.comment}"
        </p>
      )}
    </div>
  )
}
