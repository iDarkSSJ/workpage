import type { Project, ProjectSkillEntry } from "../types/projects.types"
import Card from "../../../components/Card"
import Link from "../../../components/Link"
import Tag from "../../../components/ui/Tag"
import { formatAmount } from "../../../utils/currency"
import { BrainCircuit, Clock, DollarSign } from "lucide-react"

export default function ProjectCard({ project }: { project: Project }) {
  const projectBudget =
    project.budgetMin && project.budgetMax
      ? `$${formatAmount(project.budgetMin)} - $${formatAmount(project.budgetMax)}`
      : "—"

  return (
    <Card className="flex flex-col gap-3 hover:border-primary/40 transition-colors w-full">
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-xl font-bold text-zinc-100 hover:text-primary transition-colors line-clamp-2">
          <Link path={`/projects/${project.id}`}>{project.title}</Link>
        </h3>
        <Tag variant="primary">
          {project.budgetType === "fixed" ? "Fixed Price" : "Hourly"}
        </Tag>
      </div>

      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-zinc-300 mt-2">
        <div className="flex items-center gap-1">
          <DollarSign size={18} className="text-emerald-400" />
          <span>{projectBudget}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={18} className="text-primary" />
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
          {project.skills.map((s: ProjectSkillEntry) => (
            <Tag key={s.skillId} variant="neutral">
              {s.skill.name}
            </Tag>
          ))}
        </div>
      )}
    </Card>
  )
}
