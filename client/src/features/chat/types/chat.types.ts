export interface Conversation {
  id: string
  projectId: string | null
  participantAId: string
  participantBId: string
  createdAt: string
  updatedAt: string
  participantA: { id: string; name: string; image: string | null }
  participantB: { id: string; name: string; image: string | null }
  project?: { id: string; title: string } | null
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  isRead: boolean
  createdAt: string
  status?: "sending" | "error"
}

export interface MessagesData {
  data: Message[]
  limit: number
  offset: number
}

