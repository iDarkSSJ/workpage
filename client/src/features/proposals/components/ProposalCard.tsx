import { useState } from "react"
import { useNavigate } from "react-router"
import { CheckCircle, XCircle, PencilLine, User } from "lucide-react"
import type { Proposal } from "../types/proposals.types"
import { useUpdateProposalStatus } from "../api/useProposals"
import { formatAmount } from "../../../utils/currency"
import Button from "../../../components/Button"
import Link from "../../../components/Link"
import Card from "../../../components/Card"
import Tag from "../../../components/ui/Tag"
import ProposalForm from "./ProposalForm"

interface Props {
  proposal: Proposal
  projectId: string
  projectStatus: string
  isOwner: boolean
  currentUserId: string | undefined
}

export default function ProposalCard({
  proposal,
  projectId,
  projectStatus,
  isOwner,
  currentUserId,
}: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const updateStatusMut = useUpdateProposalStatus(projectId)
  const isPending = updateStatusMut.isPending
  const navigate = useNavigate()

  const handleAction = (status: "accepted" | "rejected" | "withdrawn" | "pending") => {
    updateStatusMut.mutate(
      { id: proposal.id, data: { status } },
      {
        onSuccess: () => {
          if (status === "accepted") {
            navigate("/dashboard/contracts")
          }
        },
      }
    )
  }

  const STATUS_LABELS = {
    pending: "Pendiente",
    accepted: "Aceptada",
    rejected: "Rechazada",
    withdrawn: "Retirada",
  }

  const STATUS_VARIANTS = {
    pending: "neutral",
    accepted: "success",
    rejected: "danger",
    withdrawn: "neutral",
  } as const

  if (isEditing) {
    return (
      <ProposalForm
        mode="edit"
        proposal={proposal}
        projectId={projectId}
        onCancel={() => setIsEditing(false)}
        onSuccess={() => setIsEditing(false)}
      />
    )
  }

  const isFreelancerOwner = proposal.freelancer?.user?.id === currentUserId

  return (
    <Card className="hover:border-primary/20 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <Link
          path={`/freelancers/${proposal.freelancerId}`}
          className="flex items-center gap-4 group/user">
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 group-hover/user:border-primary/50 transition-colors">
            {proposal.freelancer?.user?.image ? (
              <img
                src={proposal.freelancer.user.image}
                alt={proposal.freelancer.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-zinc-600" size={24} />
            )}
          </div>
          <div>
            <h4 className="font-bold text-zinc-100 group-hover/user:text-primary transition-colors text-base">
              {proposal.freelancer?.user?.name}
            </h4>
            <p className="text-sm text-emerald-400 font-bold mt-0.5">
              ${formatAmount(proposal.bidAmount)}{" "}
              <span className="text-zinc-500 font-normal">
                {proposal.bidType === "fixed" ? "Pago Fijo" : "/ hora"}
              </span>
            </p>
          </div>
        </Link>

        <Tag variant={STATUS_VARIANTS[proposal.status]}>
          {STATUS_LABELS[proposal.status]}
        </Tag>
      </div>

      <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50">
        {proposal.coverLetter}
      </p>

      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-zinc-800/50">
        {/* Acciones para el dueño del proyecto */}
        {isOwner && proposal.status === "pending" && projectStatus === "open" && (
          <>
            <Button
              onClick={() => handleAction("accepted")}
              disabled={isPending}
              btnType="success"
              className="flex-1 min-w-[140px] flex justify-center items-center gap-2 py-2 rounded-lg font-bold">
              <CheckCircle size={18} />
              Aceptar Propuesta
            </Button>
            <Button
              onClick={() => handleAction("rejected")}
              disabled={isPending}
              btnType="danger"
              className="flex-1 min-w-[140px] flex justify-center items-center gap-2 py-2 rounded-lg font-bold">
              <XCircle size={18} />
              Rechazar
            </Button>
          </>
        )}

        {/* Acciones para el autor de la propuesta */}
        {!isOwner && isFreelancerOwner && (
          <div className="flex justify-end w-full gap-2">
            {(proposal.status === "pending" || proposal.status === "withdrawn") && (
              <Button
                onClick={() => setIsEditing(true)}
                btnType="secondary"
                className="flex items-center gap-2 py-2 px-4 rounded-lg font-bold transition-colors">
                <PencilLine size={18} />
                Editar
              </Button>
            )}

            {proposal.status === "pending" && (
              <Button
                onClick={() => handleAction("withdrawn")}
                disabled={isPending}
                btnType="danger"
                className="flex items-center gap-2 py-2 px-4 rounded-lg font-bold transition-colors">
                <XCircle size={18} />
                Retirar
              </Button>
            )}

            {proposal.status === "withdrawn" && (
              <Button
                onClick={() => handleAction("pending")}
                disabled={isPending}
                btnType="success"
                className="flex items-center gap-2 py-2 px-4 rounded-lg font-bold transition-colors">
                <CheckCircle size={18} />
                Re-abrir
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
