import { Pencil, Trash2 } from "lucide-react"
import type { FreelancerExperience } from "../types/profiles"
import Button from "./Button"
import Card from "./Card"
import { useLoading } from "../context/LoadingContext"
import { deleteFreelancerExperience } from "../lib/profilesApi"
import { showToast } from "./showToast"

interface SingleExperienceProps {
  exp: FreelancerExperience
  editable?: boolean
  onDeleted?: (id: string) => void
  onEdit?: (exp: FreelancerExperience) => void
}

export default function SingleExperience({
  exp,
  editable = false,
  onDeleted,
  onEdit,
}: SingleExperienceProps) {
  const { isLoading, setLoading } = useLoading()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteFreelancerExperience(exp.id)
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      showToast("success", "Experiencia eliminada")
      onDeleted?.(exp.id)
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-none bg-primary-bg/50 flex justify-between">
      <div>
        <p className="text-md font-semibold text-zinc-100">{exp.title}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{exp.company}</p>
        <p className="text-xs text-zinc-500 mt-1">
          {exp.startDate} — {exp.endDate ?? "Actual"}
        </p>
        {exp.description && (
          <p className="text-sm text-zinc-400 mt-2">{exp.description}</p>
        )}
      </div>

      {editable && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            btnType="default"
            disabled={isLoading}
            onClick={() => onEdit?.(exp)}>
            <Pencil size={20} />
          </Button>
          <Button
            type="button"
            btnType="danger"
            disabled={isLoading}
            onClick={handleDelete}>
            <Trash2 size={20} />
          </Button>
        </div>
      )}
    </Card>
  )
}
