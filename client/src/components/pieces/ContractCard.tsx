import type { Contract } from "../../types/projects"
import Link from "../Link"
import Card from "../Card"
import Button from "../Button"
import { CheckCircle, Clock } from "lucide-react"
import { cn } from "../../utils/cn"

interface ContractCardProps {
  contract: Contract
  tab: "freelancer" | "contractor"
  isLoading: boolean
  onComplete: (id: string) => void
}

// Tarjeta que muestra la informacion de un contrato
// Tiene dos pestañas: freelancer y contractor
// En cada pestaña se muestra la informacion del contrato desde la perspectiva del freelancer o del contractor
// Tambien tiene un boton para completar el contrato
export default function ContractCard({
  contract: c,
  tab,
  isLoading,
  onComplete,
}: ContractCardProps) {
  return (
    <Card className="flex flex-col md:flex-row gap-6 items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-zinc-100 line-clamp-1">
            <Link
              path={`/projects/${c.projectId}`}
              className="hover:text-primary transition-colors">
              {c.project?.title || "Proyecto Eliminado"}
            </Link>
          </h3>
          <span
            className={cn(
              "px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400",
              { "bg-blue-500/20 text-blue-400": c.status === "completed" },
            )}>
            {c.status}
          </span>
        </div>

        <div className="text-sm text-zinc-400 flex flex-wrap gap-x-6 gap-y-2">
          <span className="flex items-center gap-1">
            <CheckCircle size={14} className="text-emerald-500" />
            Acordado:{" "}
            <strong className="text-zinc-200">${c.agreedAmount}</strong>
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-primary" />
            Inicio:{" "}
            <strong className="text-zinc-200">
              {new Date(c.startedAt).toLocaleDateString()}
            </strong>
          </span>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-3 mt-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {tab === "freelancer"
              ? c.contractor?.user?.name?.charAt(0)
              : c.freelancer?.user?.name?.charAt(0)}
          </div>
          <div className="text-sm">
            <p className="text-zinc-400">
              {tab === "freelancer" ? "Contratante:" : "Freelancer:"}
            </p>
            <Link
              path={
                tab === "freelancer"
                  ? `/contractors/${c.contractorId}`
                  : `/freelancers/${c.freelancerId}`
              }
              className="font-semibold text-zinc-200 hover:text-primary transition-colors">
              {tab === "freelancer"
                ? c.contractor?.user?.name
                : c.freelancer?.user?.name}
            </Link>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="w-full md:w-auto flex flex-col gap-2 shrink-0">
        {tab === "contractor" && c.status === "active" && (
          <Button
            disabled={isLoading}
            onClick={() => onComplete(c.id)}
            btnType="success"
            className="w-full md:w-auto text-sm disabled:opacity-50">
            Completar contrato
          </Button>
        )}

        {c.status === "completed" && (
          <Button btnType="primary" className="w-full md:w-auto text-sm">
            Dejar Reseña (Próximamente)
          </Button>
        )}
      </div>
    </Card>
  )
}
