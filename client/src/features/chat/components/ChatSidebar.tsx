import { MessageSquare, User } from "lucide-react"
import { type Conversation } from "../types/chat.types"
import { useNavigate } from "react-router"
import { cn } from "../../../utils/cn"

interface Props {
  conversations: Conversation[]
  activeId?: string
  currentUserId: string
}

export default function ChatSidebar({ conversations, activeId, currentUserId }: Props) {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full bg-zinc-950/50 border-r border-zinc-800">
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <MessageSquare size={20} className="text-primary" />
          Mensajes
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-zinc-500 mt-10">
            No tienes conversaciones activas.
          </div>
        ) : (
          conversations.map((conv) => {
            const isParticipantA = conv.participantAId === currentUserId
            const otherUser = isParticipantA ? conv.participantB : conv.participantA

            const isActive = conv.id === activeId

            return (
              <button
                key={conv.id}
                onClick={() => navigate(`/dashboard/chat/${conv.id}`)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-zinc-800/50 hover:bg-zinc-900/80",
                  isActive && "bg-zinc-900 border-l-2 border-l-primary"
                )}>
                <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {otherUser.image ? (
                    <img src={otherUser.image} alt={otherUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-zinc-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-200 truncate">
                    {otherUser.name}
                  </h3>
                  {conv.project && (
                    <p className="text-xs text-primary font-medium truncate mt-0.5">
                      {conv.project.title}
                    </p>
                  )}
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}
