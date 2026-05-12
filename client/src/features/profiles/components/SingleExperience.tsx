import { Pencil, Trash2 } from "lucide-react"
import type { Experience } from "../types/profiles.types"
import Button from "../../../components/Button"
import Card from "../../../components/Card"

import { useDeleteExperience } from "../api/useExperiences.api"
import { formatDate } from "../../../utils/formatDate"

interface SingleExperienceProps {
  exp: Experience
  editable?: boolean
  onDeleted?: (id: string) => void
  onEdit?: (exp: Experience) => void
}

export default function SingleExperience({
  exp,
  editable = false,
  onDeleted,
  onEdit,
}: SingleExperienceProps) {
  const { mutate: deleteExp, isPending } = useDeleteExperience()

  const handleDelete = () => {
    deleteExp(exp.id, {
      onSuccess: () => onDeleted?.(exp.id),
    })
  }

  return (
    <Card className="w-full shadow-none bg-primary-bg/50 flex justify-between flex-wrap sm:flex-nowrap">
      <div>
        <p className="text-md font-semibold text-zinc-100">{exp.title}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{exp.company}</p>
        <p className="text-sm text-zinc-500 mt-1">
          {formatDate(exp.startDate)} —{" "}
          {exp.endDate ? formatDate(exp.endDate) : "Actual"}
        </p>
        {exp.description && (
          <p className="text-sm text-zinc-400 mt-2">{exp.description}</p>
        )}
      </div>

      {editable && (
        <div className="flex items-center gap-2 ml-auto">
          <Button
            type="button"
            btnType="default"
            disabled={isPending}
            onClick={() => onEdit?.(exp)}>
            <Pencil size={20} />
          </Button>
          <Button
            type="button"
            btnType="danger"
            disabled={isPending}
            onClick={handleDelete}>
            <Trash2 size={20} />
          </Button>
        </div>
      )}
    </Card>
  )
}
