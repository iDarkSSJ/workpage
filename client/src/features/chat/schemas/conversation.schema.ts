import { z } from "zod"

export const createConversationSchema = z.object({
  receiverId: z.string().trim(),
  projectId: z.string().trim().optional(),
})

export const sendMessageSchema = z.object({
  content: z.string().trim().min(1).max(5000, "El mensaje no puede superar los 5000 caracteres"),
})

export const queryMessagesSchema = z.object({
  offset: z.coerce.number().int().min(0).default(0),
})

export type CreateConversationData = z.infer<typeof createConversationSchema>
export type SendMessageData = z.infer<typeof sendMessageSchema>
