import type { Project } from "../../types/projects"
import Card from "../Card"
import Link from "../Link"
import { Clock, DollarSign, BrainCircuit } from "lucide-react"

export default function ProjectCard({ project }: { project: Project }) {
  const projectBudget =
    project.budgetMin && project.budgetMax
      ? `$${project.budgetMin} - $${project.budgetMax}`
      : "—"

  return (
    <Card className="flex flex-col gap-3 hover:border-primary/40 transition-colors w-full">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold text-zinc-100 hover:text-primary transition-colors line-clamp-2">
          <Link path={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <span className="shrink-0 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
          {project.budgetType === "fixed" ? "Fixed Price" : "Hourly"}
        </span>
      </div>

      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-300 mt-2">
        <div className="flex items-center gap-1">
          <DollarSign size={14} className="text-emerald-400" />
          <span>{projectBudget}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-primary" />
          <span>
            Postulado {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          Por:{" "}
          <span className="text-primary">
            {project.contractor?.user?.name || "Contractor"}
          </span>
        </div>
      </div>

      {project.skills && project.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-zinc-700/50">
          <BrainCircuit size={16} className="text-zinc-500" />
          {project.skills.map((s) => (
            <span
              key={s.skillId}
              className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
              {s.skill.name}
            </span>
          ))}
        </div>
      )}
    </Card>
  )
}
