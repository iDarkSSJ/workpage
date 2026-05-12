import { useMyProjects } from "../api/useProjects"
import Card from "../../../components/Card"
import Link from "../../../components/Link"
import Tag from "../../../components/ui/Tag"
import { Briefcase, Clock } from "lucide-react"

export default function MyProjectsSection() {
  const { data: projects, isLoading: projectsLoading } = useMyProjects()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
        <Briefcase className="text-primary" />
        Mis Proyectos Publicados
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {projectsLoading ? (
          <div className="text-zinc-500">Cargando proyectos...</div>
        ) : projects && projects.length > 0 ? (
          projects.map((p) => (
            <Card
              key={p.id}
              className="hover:border-primary/40 transition-colors w-full">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    path={`/projects/${p.id}`}
                    className="text-lg font-bold text-zinc-100 hover:text-primary transition-colors">
                    {p.title}
                  </Link>
                  <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={18} />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <Tag variant={p.status === "open" ? "success" : "neutral"}>
                      {p.status}
                    </Tag>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Propuestas</p>
                  <p className="text-lg font-bold text-primary">
                    {p.proposalCount || 0}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-8">
            <p className="text-zinc-500">
              Aún no has publicado ningún proyecto.
            </p>
            <Link
              path="/projects/new"
              className="text-primary hover:underline mt-2 inline-block">
              Publicar el primero
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
