import { useParams } from "react-router"
import { useAuth } from "../../context/AuthContext"
import { useConversations } from "../../features/chat/api/useChat"
import ChatSidebar from "../../features/chat/components/ChatSidebar"
import ChatArea from "../../features/chat/components/ChatArea"
import { MessageSquare } from "lucide-react"

export default function ChatPage() {
  const { id } = useParams()
  const { data: session } = useAuth()

  const { data: conversations, isLoading } = useConversations()

  if (!session) return null

  const userId = session.user.id

  // Encontramos la conversación activa si id existe
  const activeConversation = id ? conversations?.find((c) => c.id === id) : null

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center text-zinc-500">
        Cargando mensajes...
      </div>
    )
  }

  // Layout logic responsive:
  // Si no hay ID seleccionado: Mostrar Sidebar (100% width en mobile), Ocultar ChatArea en mobile.
  // Si hay ID seleccionado: Ocultar Sidebar en mobile, Mostrar ChatArea (100% en mobile).
  // En Desktop siempre se ven ambos (Sidebar 350px, ChatArea flex-1).

  return (
    <div className="flex w-full h-[calc(100vh-64px)] bg-primary-bg overflow-hidden relative">
      {/* Sidebar Area */}
      <div
        className={`
        ${id ? "hidden md:block" : "block w-full"}
        w-full md:w-[320px] lg:w-[380px] shrink-0 h-full border-r border-zinc-800
      `}>
        <ChatSidebar
          conversations={conversations || []}
          activeId={id}
          currentUserId={userId}
        />
      </div>

      {/* Main Chat Area */}
      <div
        className={`
        ${id ? "flex-1 absolute top-0 left-0 w-full h-full md:static md:w-auto" : "hidden md:flex flex-1"}
        h-full bg-secondary-bg relative flex-col items-center justify-center
      `}>
        {activeConversation ? (
          <div className="w-full h-full bg-secondary-bg">
            <ChatArea
              key={activeConversation.id}
              conversation={activeConversation}
              currentUserId={userId}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-zinc-500 gap-4">
            <MessageSquare size={48} className="text-primary" />
            <p>Selecciona una conversación para empezar a chatear</p>
          </div>
        )}
      </div>
    </div>
  )
}
