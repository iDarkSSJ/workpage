import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getConversationsReq,
  getMessagesReq,
  createConversationReq,
  sendMessageReq,
  markMessagesAsReadReq,
} from "./chat.api"
import type {
  CreateConversationData as CreateConversationInput,
  SendMessageData as SendMessageInput,
} from "../schemas/conversation.schema"
import { showToast } from "../../../components/showToast"

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsReq,
    refetchOnWindowFocus: false,
  })
}

export const useMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessagesReq(conversationId, 0),
    enabled: Boolean(conversationId),
    refetchOnWindowFocus: false,
    meta: { silent: true },
  })
}

export const useCreateConversation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateConversationInput) => createConversationReq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
    onError: (error: Error) =>
      showToast("error", error.message || "Error al crear conversación"),
  })
}

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: ["sendMessage", conversationId],
    mutationFn: (data: SendMessageInput) =>
      sendMessageReq(conversationId, data),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
    },
    onError: (error: Error) => {
      showToast("error", error.message || "Error al enviar mensaje")
    },
  })
}

export const useMarkMessagesAsRead = (conversationId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markMessagesAsReadReq(conversationId),
    meta: { silent: true },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] })
    },
  })
}
