import { useMyProposals } from "../api/useProposals"
import Card from "../../../components/Card"
import Link from "../../../components/Link"
import Tag from "../../../components/ui/Tag"
import { Send, Clock } from "lucide-react"
import { formatAmount } from "../../../utils/currency"

export default function MyProposalsSection() {
  const { data: proposals, isLoading: proposalsLoading } = useMyProposals()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-2">
        <Send className="text-secondary text-primary" />
        Mis Propuestas Enviadas
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {proposalsLoading ? (
          <div className="text-zinc-500">Cargando propuestas...</div>
        ) : proposals && proposals.length > 0 ? (
          proposals.map((prop) => (
            <Card
              key={prop.id}
              className="hover:border-secondary/40 transition-colors w-full">
              <div className="flex justify-between items-start">
                <div>
                  <Link
                    path={`/projects/${prop.projectId}`}
                    className="text-lg font-bold text-zinc-100 hover:text-secondary transition-colors">
                    {prop.project?.title}
                  </Link>
                  <p className="text-sm text-zinc-500 mt-1">
                    Cliente: {prop.project?.contractor?.user?.name}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Clock size={18} />
                      {new Date(prop.createdAt).toLocaleDateString()}
                    </span>
                    <Tag
                      variant={
                        prop.status === "accepted"
                          ? "success"
                          : prop.status === "rejected"
                            ? "danger"
                            : "neutral"
                      }>
                      {prop.status}
                    </Tag>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Tu oferta</p>
                  <p className="text-lg font-bold text-zinc-200">
                    ${formatAmount(prop.bidAmount)}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="text-center py-8 w-full">
            <p className="text-zinc-500">
              Aún no has enviado ninguna propuesta.
            </p>
            <Link
              path="/projects"
              className="text-secondary hover:underline mt-2 inline-block text-primary">
              Ver proyectos disponibles
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
