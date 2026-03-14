export interface Conversation {
  id: string
  projectId: string | null
  participantAId: string
  participantBId: string
  createdAt: string
  updatedAt: string
  // relaciones incluidas en GET /api/conversations
  participantA?: { id: string; name: string; image: string | null }
  participantB?: { id: string; name: string; image: string | null }
  project?: { id: string; title: string } | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
}

// Respuesta de GET /api/conversations/:id/messages
export interface MessagesResponse {
  data: Message[]
  limit: number
  offset: number
}

export type CreateConversationInput = {
  receiverId: string
  projectId?: string
}

export type SendMessageInput = {
  content: string
}
