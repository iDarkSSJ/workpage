import { useEffect, useState } from "react"
import { getProjects } from "../lib/projectsApi"
import type { Project } from "../types/projects"
import ProjectCard from "../components/pieces/ProjectCard"
import Input from "../components/ui/Input"
import Button from "../components/Button"
import Card from "../components/Card"
import { showToast } from "../components/showToast"
import { SlidersHorizontal, ChevronRight, ChevronLeft } from "lucide-react"

import { useLoading } from "../context/LoadingContext"

// respuesta paginada del servidor
type PagedResult = {
  data: Project[]
  page: number
  limit: number
}

export default function ProjectsPage() {
  const [data, setData] = useState<PagedResult | null>(null)
  const { isLoading, setLoading } = useLoading()
  const [page, setPage] = useState(1)
  const [minBudget, setMinBudget] = useState("")
  const [maxBudget, setMaxBudget] = useState("")

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await getProjects({
        page,
        limit: 10,
        minBudget: minBudget ? Number(minBudget) : undefined,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
      })
      if (!res.success) {
        showToast("error", res.error)
        return
      }
      setData(res.data as PagedResult)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar proyectos"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProjects()
  }

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
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

          {!isLoading &&
            (data?.data && data.data.length > 0 ? (
              <div className="flex flex-col gap-4">
                {data.data.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-500">
                No se encontraron proyectos abiertos.
              </div>
            ))}

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
    </main>
  )
}
