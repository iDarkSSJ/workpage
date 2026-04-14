import { api } from "../../../lib/api"
import type {
  Conversation,
  Message,
  MessagesData,
} from "../types/chat.types"
import type {
  CreateConversationData as CreateConversationInput,
  SendMessageData as SendMessageInput,
} from "../schemas/conversation.schema"

export function getConversationsReq() {
  return api.get<Conversation[]>("/conversations")
}

export function createConversationReq(data: CreateConversationInput) {
  return api.post<Conversation>("/conversations", data)
}

export function getMessagesReq(conversationId: string, offset = 0) {
  return api.get<MessagesData>(
    `/conversations/${conversationId}/messages?offset=${offset}`,
  )
}

export function sendMessageReq(conversationId: string, data: SendMessageInput) {
  return api.post<Message>(`/conversations/${conversationId}/messages`, data)
}

export function markMessagesAsReadReq(conversationId: string) {
  return api.put<{ success: boolean; message: string }>(
    `/conversations/${conversationId}/messages/read`,
    {},
  )
}
