import { useState } from "react"
import { useProjects } from "../features/projects/api/useProjects"
import ProjectCard from "../features/projects/components/ProjectCard"
import Input from "../components/ui/Input"
import Button from "../components/Button"
import Card from "../components/Card"
import { SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react"

export default function ProjectsPage() {
  const [page, setPage] = useState(1)
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")
  const [activeFilters, setActiveFilters] = useState<{
    minBudget?: number
    maxBudget?: number
  }>({})

  const { data } = useProjects({
    page,
    limit: 10,
    ...activeFilters,
  })

  const handleFilter = (e: React.SubmitEvent) => {
    e.preventDefault()
    setPage(1)
    setActiveFilters({
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
    })
  }

  return (
    <div className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* sidebar de filtros */}
        <aside className="w-full md:w-80 shrink-0">
          <Card className="sticky top-6">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <SlidersHorizontal size={18} className="text-primary" /> Filtros
            </h2>
            <form onSubmit={handleFilter} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300">
                  Presupuesto ($)
                </label>
                <div className="flex gap-2">
                  <Input
                    label="Mínimo"
                    placeholder="Min"
                    value={minBudget}
                    onChange={(e) => setMinBudget(e.target.value)}
                    className="w-full"
                  />
                  <Input
                    label="Máximo"
                    placeholder="Max"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <Button
                type="submit"
                btnType="secondary"
                className="w-full text-sm py-2">
                Aplicar filtros
              </Button>
            </form>
          </Card>
        </aside>

        {/* listado de proyectos */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-zinc-100">
              Proyectos abiertos
            </h1>
          </div>

          {data?.data && data.data.length > 0 ? (
            <div className="flex flex-col gap-4">
              {data.data.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-zinc-500">
              No se encontraron proyectos abiertos.
            </div>
          )}

          {/* paginación */}
          {data && data.data.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t border-zinc-800">
              <Button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}>
                <ChevronLeft size={20} />
              </Button>
              <span className="text-sm font-medium text-zinc-400">
                Página {page}
              </span>
              <Button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={data.data.length < data.limit}>
                <ChevronRight size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
