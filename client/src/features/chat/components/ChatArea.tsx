import { useEffect, useState, useRef } from "react"
import { Send, ChevronLeft, User, RefreshCcw, Trash2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import {
  useMessages,
  useSendMessage,
  useMarkMessagesAsRead,
} from "../api/useChat"
import { getMessagesReq } from "../api/chat.api"
import { getSocket } from "../api/socketClient"
import type { Conversation, Message, MessagesData } from "../types/chat.types"
import { sendMessageSchema } from "../schemas/conversation.schema"
import Button from "../../../components/Button"
import { cn } from "../../../utils/cn"
import { showToast } from "../../../components/showToast"

interface Props {
  conversation: Conversation
  currentUserId: string
}

export default function ChatArea({ conversation, currentUserId }: Props) {
  const [content, setContent] = useState("")
  const [error, setError] = useState("")
  const [historicalMessages, setHistoricalMessages] = useState<Message[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [hasMoreHistory, setHasMoreHistory] = useState(true)

  // Mensajes que están actualmente en proceso de envío (memoria)
  const [sendingMessages, setSendingMessages] = useState<Message[]>([])

  // Mensajes que fallaron (persistencia local)
  const [failedMessages, setFailedMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`chat_failed_${conversation.id}`)
    return saved ? JSON.parse(saved) : []
  })

  const bottomRef = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: messagesData, isLoading } = useMessages(conversation.id)
  const sendMut = useSendMessage(conversation.id)
  const { mutate: markAsRead } = useMarkMessagesAsRead(conversation.id)

  const isParticipantA = conversation.participantAId === currentUserId
  const otherUser = isParticipantA
    ? conversation.participantB
    : conversation.participantA

  // mensaje en borrador
  const DRAFT_KEY = `chat_draft_${conversation.id}`

  // Cargar borrador al montar
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_KEY)
    if (savedDraft) {
      setContent(savedDraft)
    }
  }, [DRAFT_KEY])

  // Guardar errores al obtener un mensaje fallido
  useEffect(() => {
    localStorage.setItem(
      `chat_failed_${conversation.id}`,
      JSON.stringify(failedMessages),
    )
  }, [failedMessages, conversation.id])

  // Guardar borrador al escribir
  useEffect(() => {
    if (content.trim()) {
      localStorage.setItem(DRAFT_KEY, content)
    } else {
      localStorage.removeItem(DRAFT_KEY)
    }
  }, [content, DRAFT_KEY])

  // WebSockets e inicialización
  useEffect(() => {
    markAsRead()

    const socket = getSocket()
    socket.connect()

    socket.emit("join_conversation", conversation.id)

    const handleNewMessage = (newMessage: Message) => {
      queryClient.setQueryData(
        ["messages", conversation.id],
        (oldData: MessagesData | undefined) => {
          if (!oldData) return { data: [newMessage], limit: 20, offset: 0 }

          // verifica si el mensaje ya existe (duplicado preventivo)
          const exists = oldData.data.find(
            (m: Message) => m.id === newMessage.id,
          )

          if (exists) return oldData

          // Mantiene solo un maximo de 20 en la vista activa localmente
          return {
            ...oldData,
            data: [newMessage, ...oldData.data].slice(0, 20),
          }
        },
      )

      // si el mensaje es ajeno, dispara la mutación de marcar como leído
      if (newMessage.senderId !== currentUserId) {
        markAsRead()
      }
    }

    socket.on("new_message", handleNewMessage)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.emit("leave_conversation", conversation.id)
    }
  }, [conversation.id, currentUserId, markAsRead, queryClient])

  // este useEffect se encarga de hacer scroll al final de la conversación
  const cachedMessagesLength = messagesData?.data?.length
  useEffect(() => {
    if (cachedMessagesLength === 20) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [cachedMessagesLength])

  // synthetic event es un evento que puede ser de cualquier tipo, por que puede venir de un form o de un keydown.
  const handleSend = (e?: React.SyntheticEvent, retryMsg?: Message) => {
    if (e) e.preventDefault()

    const text = retryMsg ? retryMsg.content : content
    if (!text.trim()) return

    const parsed = sendMessageSchema.safeParse({ content: text })
    if (!parsed.success) {
      setError(parsed.error.issues[0].message)
      return
    }

    setError("")

    // Si no es un reintento, limpiamos el input y el draft
    if (!retryMsg) {
      setContent("")
      localStorage.removeItem(DRAFT_KEY)
    } else {
      // Si es reintento, lo quitamos de la lista de fallidos mientras probamos
      setFailedMessages((prev) => prev.filter((m) => m.id !== retryMsg.id))
    }

    const tempId = retryMsg?.id || `temp-${Date.now()}`
    const optimisticMsg: Message = {
      id: tempId,
      conversationId: conversation.id,
      senderId: currentUserId,
      content: text,
      isRead: false,
      createdAt: new Date().toISOString(),
      status: "sending",
    }

    // Añadir a "enviando"
    setSendingMessages((prev) => [...prev, optimisticMsg])

    sendMut.mutate(
      { content: text },
      {
        onSuccess: () => {
          setSendingMessages((prev) => prev.filter((m) => m.id !== tempId))
        },
        onError: () => {
          setSendingMessages((prev) => prev.filter((m) => m.id !== tempId))
          const errorMsg: Message = { ...optimisticMsg, status: "error" }
          setFailedMessages((prev) => [...prev, errorMsg])
        },
      },
    )
  }

  const handleDiscard = (msgId: string) => {
    setFailedMessages((prev) => prev.filter((m) => m.id !== msgId))
  }

  const loadHistory = async () => {
    if (isLoadingHistory || !hasMoreHistory) return
    setIsLoadingHistory(true)
    try {
      const offsetToUse = 20 + historicalMessages.length
      const res = await getMessagesReq(conversation.id, offsetToUse)

      if (res.data.length < 20) {
        setHasMoreHistory(false)
      }

      // Evitar meter duplicados
      const newUnique = res.data.filter(
        (mNew) => !historicalMessages.some((mOld) => mOld.id === mNew.id),
      )

      setHistoricalMessages((prev) => [...prev, ...newUnique])
    } catch (err) {
      console.error(err)
      showToast("error", "Error al cargar mensajes")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const historyReversed = [...historicalMessages].reverse()
  const baseReversed = [...(messagesData?.data || [])].reverse()
  // Unimos todo: Historial antiguo + Base (Query) + Mensajes Fallidos + Mensajes Enviando
  // Nota: Al revertir al final, los enviando/fallidos (más recientes) quedarán abajo
  const messagesReversed = [
    ...historyReversed,
    ...baseReversed,
    ...failedMessages,
    ...sendingMessages,
  ]

  return (
    <div className="flex flex-col h-full bg-secondary-bg">
      {/* Header */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-800 bg-secondary-bg shrink-0 gap-3">
        <button
          onClick={() => navigate("/dashboard/chat")}
          className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white">
          <ChevronLeft size={24} />
        </button>

        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
          {otherUser.image ? (
            <img
              src={otherUser.image}
              alt={otherUser.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={20} className="text-zinc-500" />
          )}
        </div>

        <div>
          <h3 className="font-bold text-zinc-100 leading-none">
            {otherUser.name}
          </h3>
          {conversation.project && (
            <p className="text-xs text-primary font-medium mt-1">
              Proyecto: {conversation.project.title}
            </p>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && messagesReversed.length === 0 ? (
          <div className="text-center text-zinc-500 mt-10">
            Cargando mensajes...
          </div>
        ) : (
          <>
            {hasMoreHistory && messagesReversed.length >= 20 && (
              <div className="flex justify-center my-2">
                <Button
                  onClick={loadHistory}
                  disabled={isLoadingHistory}
                  btnType="secondary"
                  className="text-xs px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700">
                  {isLoadingHistory ? "Cargando..." : "Cargar anteriores"}
                </Button>
              </div>
            )}
            {messagesReversed.map((msg) => {
              const isMe = msg.senderId === currentUserId
              return (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    isMe ? "justify-end" : "justify-start",
                  )}>
                  <div
                    className={cn(
                      "max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm transition-all relative group",
                      isMe
                        ? "bg-primary text-primary-content rounded-br-sm"
                        : "bg-zinc-800 text-zinc-200 rounded-bl-sm",
                      msg.status === "sending" && "opacity-60 grayscale-[0.5]",
                      msg.status === "error" &&
                        "bg-danger/20 border border-danger/50 text-danger-content",
                    )}
                    style={{ wordBreak: "break-word" }}>
                    {msg.content}

                    {msg.status === "sending" && (
                      <span className="block text-[10px] opacity-70 mt-1 italic">
                        Enviando...
                      </span>
                    )}

                    {msg.status === "error" && (
                      <div className="mt-2 flex items-center gap-3 pt-2 border-t border-danger/20">
                        <button
                          onClick={() => handleSend(undefined, msg)}
                          className="flex items-center gap-1 text-[11px] font-bold hover:underline">
                          <RefreshCcw size={12} /> Reintentar
                        </button>
                        <button
                          onClick={() => handleDiscard(msg.id)}
                          className="flex items-center gap-1 text-[11px] font-bold opacity-60 hover:opacity-100">
                          <Trash2 size={12} /> Descartar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-zinc-950/50 border-t border-zinc-800">
        <form onSubmit={handleSend} className="flex flex-col gap-2">
          {error && (
            <span className="text-xs text-danger font-bold">{error}</span>
          )}
          <div className="flex gap-2 relative">
            <textarea
              maxLength={500}
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                if (error) setError("")
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend(e)
                }
              }}
              placeholder="Escribe un mensaje..."
              disabled={sendMut.isPending}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-primary resize-none min-h-[50px] max-h-[150px]"
              rows={1}
            />
            <Button
              type="submit"
              disabled={sendMut.isPending || !content.trim()}
              btnType="primary"
              className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 self-end mb-0.5">
              <Send size={18} className="ml-0.5" />
            </Button>
          </div>
          <span className="text-xs text-zinc-500 text-center md:text-right hidden sm:block">
            Presiona{" "}
            <kbd className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">
              Enter
            </kbd>{" "}
            para enviar
          </span>
        </form>
      </div>
    </div>
  )
}
