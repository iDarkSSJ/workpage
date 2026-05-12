import { Pencil, Trash2 } from "lucide-react"
import type { PortfolioItem } from "../types/profiles.types"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Link from "../../../components/Link"

import { useDeletePortfolio } from "../api/usePortfolio.api"

interface SinglePortfolioProps {
  project: PortfolioItem
  editable?: boolean
  onDeleted?: (id: string) => void
  onEdit?: (project: PortfolioItem) => void
}

export default function SinglePortfolio({
  project,
  editable = false,
  onDeleted,
  onEdit,
}: SinglePortfolioProps) {
  const { mutate: deletePort, isPending } = useDeletePortfolio()

  const handleDelete = () => {
    deletePort(project.id, {
      onSuccess: () => onDeleted?.(project.id),
    })
  }

  return (
    <Card className="w-full shadow-none bg-primary-bg/50 flex flex-col sm:flex-row justify-between gap-4 flex-wrap sm:flex-nowrap">
      <div className="flex flex-col sm:flex-row gap-4 min-w-0 flex-1">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full sm:w-32 sm:h-24 object-cover rounded-md border border-zinc-700/50 shrink-0"
          />
        )}
        <div className="min-w-0 flex-col flex justify-center">
          <p className="text-md font-semibold text-zinc-100">{project.title}</p>
          {project.description && (
            <p className="text-sm text-zinc-300 mt-1">{project.description}</p>
          )}
          {project.projectUrl && (
            <Link
              path={project.projectUrl}
              isExternal
              className="text-sm text-primary hover:underline mt-2 inline-block">
              Ver proyecto
            </Link>
          )}
        </div>
      </div>

      {editable && (
        <div className="flex items-center gap-2 ml-auto">
          <Button
            type="button"
            btnType="default"
            disabled={isPending}
            onClick={() => onEdit?.(project)}>
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
