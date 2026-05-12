import { useState } from "react"
import { useCreateReview, useUpdateReview } from "../api/useReviews"
import { createReviewSchema } from "../schemas/reviews.schema"
import StarRating from "./StarRating"
import TextArea from "../../../components/ui/TextArea"
import Button from "../../../components/Button"
import { Award, Send, XCircle, CheckCircle } from "lucide-react"
import type { Review } from "../types/reviews.types"

interface Props {
  mode?: "create" | "edit"
  initialData?: Review
  contractId?: string
  projectName: string
  onCancel: () => void
  onSuccess?: () => void
}

export default function ReviewForm({
  mode = "create",
  initialData,
  contractId,
  projectName,
  onCancel,
  onSuccess,
}: Props) {
  const [rating, setRating] = useState(() =>
    mode === "edit" && initialData ? Number(initialData.rating) : 5,
  )
  const [comment, setComment] = useState(() =>
    mode === "edit" && initialData ? initialData.comment || "" : "",
  )
  const [error, setError] = useState("")

  const createMut = useCreateReview()
  const updateMut = useUpdateReview()

  const isPending = createMut.isPending || updateMut.isPending

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = createReviewSchema.safeParse({ rating, comment })

    if (!validation.success) {
      setError(validation.error.issues[0].message)
      return
    }

    if (mode === "create" && contractId) {
      createMut.mutate(
        { contractId, data: validation.data },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess()
          },
        },
      )
    } else if (mode === "edit" && initialData) {
      updateMut.mutate(
        { id: initialData.id, data: validation.data },
        {
          onSuccess: () => {
            if (onSuccess) onSuccess()
          },
        },
      )
    }
  }

  return (
    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 mt-4">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="font-bold text-zinc-100 flex items-center gap-2 text-lg">
            {mode === "create" ? (
              <>
                <Award size={20} className="text-primary" />
                Dejar Valoración
              </>
            ) : (
              <>
                <CheckCircle size={20} className="text-emerald-500" />
                Editar Valoración
              </>
            )}
          </h4>
          <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider bg-zinc-800 px-2 py-1 rounded">
            {projectName}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <p className="text-zinc-300 font-bold text-sm uppercase tracking-wide">
              {mode === "create"
                ? "¿Cómo fue tu experiencia?"
                : "Actualiza tu experiencia"}
            </p>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <TextArea
            max={400}
            label="Detalles adicionales (opcional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full h-32"
          />

          {error && (
            <p className="text-xs text-danger font-bold bg-danger/10 p-2 rounded-lg border border-danger/20 animate-in fade-in zoom-in-95 duration-200">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2 flex-wrap">
            <Button
              type="submit"
              disabled={isPending}
              btnType={mode === "create" ? "secondary" : "success"}
              className="flex-1 flex justify-center items-center gap-2 py-2.5 font-bold text-base rounded-xl">
              {mode === "create" ? (
                <Send size={18} />
              ) : (
                <CheckCircle size={18} />
              )}
              {isPending
                ? "Procesando..."
                : mode === "create"
                  ? "Publicar Valoración"
                  : "Guardar Cambios"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              btnType="danger"
              className="flex-1 flex justify-center items-center gap-2 py-2.5 font-bold rounded-xl">
              <XCircle size={18} />
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
