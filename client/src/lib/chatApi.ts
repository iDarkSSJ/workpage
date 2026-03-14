import { api } from "./api"
import type {
  Conversation,
  Message,
  MessagesResponse,
  CreateConversationInput,
  SendMessageInput,
} from "../types/chat"

// GET /api/conversations — mis conversaciones (ordenadas por updatedAt)
export function getConversations() {
  return api.get<Conversation[]>("/conversations")
}

// POST /api/conversations — crear o encontrar conversación existente
export function createConversation(data: CreateConversationInput) {
  return api.post<Conversation>("/conversations", data)
}

// GET /api/conversations/:id/messages — historial paginado
export function getMessages(conversationId: string, offset = 0) {
  return api.get<MessagesResponse>(
    `/conversations/${conversationId}/messages?offset=${offset}`,
  )
}

// POST /api/conversations/:id/messages — enviar mensaje
export function sendMessage(conversationId: string, data: SendMessageInput) {
  return api.post<Message>(`/conversations/${conversationId}/messages`, data)
}

// PUT /api/conversations/:id/messages/read — marcar mensajes como leídos
export function markMessagesAsRead(conversationId: string) {
  return api.put<{ success: boolean; message: string }>(
    `/conversations/${conversationId}/messages/read`,
    {},
  )
}
