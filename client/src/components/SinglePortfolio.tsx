import { Pencil, Trash2 } from "lucide-react"
import type { FeaturedProject } from "../types/profiles"
import Button from "./Button"
import Card from "./Card"
import Link from "./Link"
import { useLoading } from "../context/LoadingContext"
import { deleteFreelancerPortfolioItem } from "../lib/profilesApi"
import { showToast } from "./showToast"

interface SinglePortfolioProps {
  project: FeaturedProject
  editable?: boolean
  onDeleted?: (id: string) => void
  onEdit?: (project: FeaturedProject) => void
}

export default function SinglePortfolio({
  project,
  editable = false,
  onDeleted,
  onEdit,
}: SinglePortfolioProps) {
  const { isLoading, setLoading } = useLoading()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteFreelancerPortfolioItem(project.id)
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      showToast("success", "Proyecto eliminado")
      onDeleted?.(project.id)
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
    <Card className="w-full shadow-none bg-primary-bg/50 flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex flex-col sm:flex-row gap-4 min-w-0 flex-1">
        {project.imageUrl && (
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full sm:w-32 sm:h-24 object-cover rounded-md border border-zinc-700/50 shrink-0"
          />
        )}
        <div className="min-w-0 flex-col flex justify-center">
          <p className="text-md font-semibold text-zinc-100">
            {project.title}
          </p>
          {project.description && (
            <p className="text-sm text-zinc-300 mt-1">
              {project.description}
            </p>
          )}
          {project.projectUrl && (
            <Link
              path={project.projectUrl}
              isExternal
              className="text-xs text-primary hover:underline mt-2 inline-block">
              Ver proyecto
            </Link>
          )}
        </div>
      </div>

      {editable && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            btnType="default"
            disabled={isLoading}
            onClick={() => onEdit?.(project)}>
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
