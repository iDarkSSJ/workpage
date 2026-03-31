import { Request, Response } from "express"
import * as conversationService from "../services/conversation.service"
import { queryMessagesSchema } from "../schemas/conversation.schema"

export const getConversations = async (req: Request, res: Response) => {
  const conversations = await conversationService.getConversations(
    req.session!.user.id,
  )
  res.json(conversations)
}

export const createConversation = async (req: Request, res: Response) => {
  const newConversation = await conversationService.createConversation(
    req.session!.user.id,
    req.body,
  )
  res.status(201).json(newConversation)
}

export const getMessages = async (req: Request, res: Response) => {
  const { offset } = queryMessagesSchema.parse(req.query)
  const messages = await conversationService.getMessages(
    req.session!.user.id,
    req.params.id as string,
    offset,
  )
  res.json(messages)
}

export const sendMessage = async (req: Request, res: Response) => {
  const newMessage = await conversationService.sendMessage(
    req.session!.user.id,
    req.params.id as string,
    req.body,
  )
  res.status(201).json(newMessage)
}

export const markMessagesAsRead = async (req: Request, res: Response) => {
  const result = await conversationService.markMessagesAsRead(
    req.session!.user.id,
    req.params.id as string,
  )
  res.json(result)
}
