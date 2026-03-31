import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, or, and, desc, isNull, ne } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import {
  CreateConversationData,
  SendMessageData,
} from "../schemas/conversation.schema"

export const getConversations = async (userId: string) => {
  return db.query.conversation.findMany({
    where: or(
      eq(schema.conversation.participantAId, userId),
      eq(schema.conversation.participantBId, userId),
    ),
    with: {
      participantA: { columns: { name: true, image: true, id: true } },
      participantB: { columns: { name: true, image: true, id: true } },
      project: { columns: { title: true, id: true } },
    },
    orderBy: [desc(schema.conversation.updatedAt)],
  })
}

export const createConversation = async (
  userId: string,
  data: CreateConversationData,
) => {
  if (userId === data.receiverId) {
    throw new AppError("No puedes iniciar una conversación contigo mismo", 400)
  }

  if (data.projectId) {
    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, data.projectId),
      with: { contractor: true },
    })

    if (!project || !project.contractor) {
      throw new AppError("El proyecto especificado no existe", 404)
    }

    const isUserOwner = project.contractor.userId === userId
    const isReceiverOwner = project.contractor.userId === data.receiverId

    if (!isUserOwner && !isReceiverOwner) {
      throw new AppError(
        "Acceso denegado: Ninguno de los participantes es el dueño de este proyecto",
        403,
      )
    }
  }

  const [pA, pB] = [userId, data.receiverId].sort()

  const existing = await db.query.conversation.findFirst({
    where: data.projectId
      ? and(
          eq(schema.conversation.participantAId, pA),
          eq(schema.conversation.participantBId, pB),
          eq(schema.conversation.projectId, data.projectId),
        )
      : and(
          eq(schema.conversation.participantAId, pA),
          eq(schema.conversation.participantBId, pB),
          isNull(schema.conversation.projectId),
        ),
  })

  if (existing) return existing

  const [newConversation] = await db
    .insert(schema.conversation)
    .values({
      id: crypto.randomUUID(),
      projectId: data.projectId || null,
      participantAId: pA,
      participantBId: pB,
    })
    .returning()

  return newConversation
}

export const getMessages = async (
  userId: string,
  conversationId: string,
  offset: number,
) => {
  const LIMIT = 20

  const conversation = await db.query.conversation.findFirst({
    where: eq(schema.conversation.id, conversationId),
  })

  if (!conversation) {
    throw new AppError("Conversación no encontrada", 404)
  }

  if (
    conversation.participantAId !== userId &&
    conversation.participantBId !== userId
  ) {
    throw new AppError("No eres un participante en esta conversación", 403)
  }

  const messages = await db.query.message.findMany({
    where: eq(schema.message.conversationId, conversationId),
    orderBy: [desc(schema.message.createdAt)],
    limit: LIMIT,
    offset,
  })

  return { data: messages, limit: LIMIT, offset }
}

export const sendMessage = async (
  userId: string,
  conversationId: string,
  data: SendMessageData,
) => {
  const conversation = await db.query.conversation.findFirst({
    where: eq(schema.conversation.id, conversationId),
  })

  if (!conversation) {
    throw new AppError("Conversación no encontrada", 404)
  }

  if (
    conversation.participantAId !== userId &&
    conversation.participantBId !== userId
  ) {
    throw new AppError("No eres un participante en esta conversación", 403)
  }

  // Transacción: Guardamos el mensaje y actualizamos el "updatedAt" del chat simultáneamente
  const [newMessage] = await db.transaction(async (tx) => {
    const [insertedMsg] = await tx
      .insert(schema.message)
      .values({
        id: crypto.randomUUID(),
        conversationId: conversation.id,
        senderId: userId,
        content: data.content,
        isRead: false,
      })
      .returning()

    await tx
      .update(schema.conversation)
      .set({ updatedAt: new Date() })
      .where(eq(schema.conversation.id, conversation.id))

    return [insertedMsg]
  })

  return newMessage
}

export const markMessagesAsRead = async (
  userId: string,
  conversationId: string,
) => {
  const conversation = await db.query.conversation.findFirst({
    where: eq(schema.conversation.id, conversationId),
  })

  if (!conversation) {
    throw new AppError("Conversación no encontrada", 404)
  }

  if (
    conversation.participantAId !== userId &&
    conversation.participantBId !== userId
  ) {
    throw new AppError("No eres un participante en esta conversación", 403)
  }

  await db
    .update(schema.message)
    .set({ isRead: true })
    .where(
      and(
        eq(schema.message.conversationId, conversationId),
        ne(schema.message.senderId, userId),
        eq(schema.message.isRead, false),
      ),
    )

  return { success: true, message: "Mensajes marcados como leídos" }
}
