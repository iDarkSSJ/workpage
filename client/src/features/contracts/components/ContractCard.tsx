import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Calendar,
  DollarSign,
  User,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Star,
} from "lucide-react"
import { useAuth } from "../../../context/AuthContext"
import { type Contract } from "../types/contracts.types"
import { formatAmount } from "../../../utils/currency"
import Button from "../../../components/Button"
import Link from "../../../components/Link"
import Card from "../../../components/Card"
import Tag from "../../../components/ui/Tag"
import { useCompleteContract, useCancelContract } from "../api/useContracts"
import { useCreateConversation } from "../../chat/api/useChat"
import ReviewForm from "../../reviews/components/ReviewForm"

interface Props {
  contract: Contract
  role: "freelancer" | "contractor"
}

export default function ContractCard({ contract, role }: Props) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { data: session } = useAuth()
  const completeMut = useCompleteContract()
  const cancelMut = useCancelContract()
  const createChatMut = useCreateConversation()
  const navigate = useNavigate()

  const currentUserId = session?.user?.id
  const hasReviewed = contract.reviews?.some(
    (r) => r.reviewerId === currentUserId,
  )

  const isPending = completeMut.isPending || cancelMut.isPending

  const otherParty =
    role === "freelancer" ? contract.contractor : contract.freelancer
  const otherRoleLabel = role === "freelancer" ? "Contratante" : "Freelancer"

  const statusVariants = {
    active: "blue",
    completed: "success",
    cancelled: "neutral",
  } as const

  const statusLabels = {
    active: "En Curso",
    completed: "Finalizado",
    cancelled: "Cancelado",
  }

  const handleComplete = () => {
    if (
      confirm(
        "¿Estás seguro de marcar este contrato como completado? Esto también cerrará el proyecto.",
      )
    ) {
      completeMut.mutate(contract.id)
    }
  }

  const handleCancel = () => {
    if (
      confirm(
        "¿Estás seguro de cancelar este contrato? El proyecto se marcará como cerrado.",
      )
    ) {
      cancelMut.mutate(contract.id)
    }
  }

  const handleOpenChat = () => {
    createChatMut.mutate(
      {
        receiverId: otherParty.user.id,
        projectId: contract.projectId,
      },
      {
        onSuccess: (conversation) => {
          navigate(`/dashboard/chat/${conversation.id}`)
        },
      },
    )
  }

  return (
    <Card className="hover:border-primary/30 transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-4">
        <div className="w-full sm:flex-1">
          <Link
            path={`/projects/${contract.projectId}`}
            className="block text-lg font-bold text-zinc-100 hover:text-primary transition-colors truncate">
            {contract.project.title}
          </Link>
        </div>
        <Tag
          variant={statusVariants[contract.status]}
          className="shrink-0 w-fit">
          {statusLabels[contract.status]}
        </Tag>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/50">
          <span className="text-sm uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
            <DollarSign size={16} /> Acordado
          </span>
          <p className="text-base font-bold text-emerald-400 leading-none">
            ${formatAmount(contract.agreedAmount)}
            <span className="text-sm text-zinc-500 ml-1 font-normal">
              {contract.project.budgetType === "fixed" ? "total" : "/hr"}
            </span>
          </p>
        </div>

        <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/50">
          <span className="text-sm uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
            <Calendar size={16} /> Iniciado
          </span>
          <p className="text-base font-semibold text-zinc-300 leading-none">
            {new Date(contract.startedAt).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-zinc-900/60 rounded-xl p-3 border border-zinc-800/50">
          <span className="text-sm uppercase tracking-wider text-zinc-500 font-bold flex items-center gap-1.5 mb-1">
            <Clock size={16} /> Finalizado
          </span>
          <p className="text-base font-semibold text-zinc-300 leading-none">
            {contract.completedAt
              ? new Date(contract.completedAt).toLocaleDateString()
              : "Aún no finalizado"}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800/50">
        <Link
          path={`/${role === "freelancer" ? "contractors" : "freelancers"}/${otherParty.id}`}
          className="flex w-full sm:w-auto sm:flex-1 items-center gap-3 hover:bg-zinc-800/30 p-2 rounded-xl transition-colors -ml-2">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
            {otherParty.user.image ? (
              <img
                src={otherParty.user.image}
                alt={otherParty.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-zinc-600" size={20} />
            )}
          </div>
          <div>
            <span className="text-sm uppercase text-zinc-500 font-bold block leading-none mb-1">
              {otherRoleLabel}
            </span>
            <p className="text-base font-bold text-zinc-200 leading-none">
              {otherParty.user.name}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          <Button
            onClick={handleOpenChat}
            disabled={createChatMut.isPending}
            btnType="primary"
            className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold">
            <MessageSquare size={18} />
            Chat
          </Button>
          {role === "contractor" && contract.status === "active" && (
            <>
              <Button
                onClick={handleComplete}
                disabled={isPending}
                btnType="success"
                className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold">
                <CheckCircle size={18} />
                Completar
              </Button>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                btnType="danger"
                className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold">
                <XCircle size={18} />
                Cancelar
              </Button>
            </>
          )}

          {contract.status === "completed" &&
            !hasReviewed &&
            !showReviewForm && (
              <Button
                onClick={() => setShowReviewForm(true)}
                btnType="secondary"
                className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
                <Star size={18} fill="currentColor" />
                Valorar
              </Button>
            )}

          {contract.status === "completed" && hasReviewed && (
            <Button
              onClick={() =>
                navigate(
                  `/${role === "freelancer" ? "contractors" : "freelancers"}/${otherParty.id}`
                )
              }
              btnType="secondary"
              className="flex flex-1 sm:flex-none justify-center items-center gap-2 px-4 py-2 text-sm rounded-lg font-bold bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700">
              <Star size={18} fill="currentColor" className="text-amber-500" />
              Ver valoración
            </Button>
          )}
        </div>
      </div>

      {showReviewForm && (
        <ReviewForm
          contractId={contract.id}
          projectName={contract.project.title}
          onCancel={() => setShowReviewForm(false)}
          onSuccess={() => {
            setShowReviewForm(false)
            navigate(
              `/${role === "freelancer" ? "contractors" : "freelancers"}/${otherParty.id}`
            )
          }}
        />
      )}
    </Card>
  )
}
