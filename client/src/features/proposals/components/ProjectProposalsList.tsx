import type { Proposal } from "../types/proposals.types"
import ProposalCard from "./ProposalCard"

interface Props {
  proposals: Proposal[]
  projectId: string
  projectStatus: string
  isOwner: boolean
  currentUserId: string | undefined
}

export default function ProjectProposalsList({
  proposals,
  projectId,
  projectStatus,
  isOwner,
  currentUserId,
}: Props) {
  if (proposals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 text-center">
        <p className="text-zinc-500 font-medium">
          Aún no hay propuestas para este proyecto.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {proposals.map((prop) => (
        <ProposalCard
          key={prop.id}
          proposal={prop}
          projectId={projectId}
          projectStatus={projectStatus}
          isOwner={isOwner}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
