import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { validate } from "../middleware/validate"
import {
  createConversationSchema,
  sendMessageSchema,
} from "../schemas/conversation.schema"
import {
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "../controllers/conversation.controller"

const conversationsRouter = Router()

conversationsRouter.get("/", requireAuth, getConversations)
conversationsRouter.post(
  "/",
  requireAuth,
  validate(createConversationSchema),
  createConversation,
)

conversationsRouter.get("/:id/messages", requireAuth, getMessages)
conversationsRouter.post(
  "/:id/messages",
  requireAuth,
  validate(sendMessageSchema),
  sendMessage,
)
conversationsRouter.put("/:id/messages/read", requireAuth, markMessagesAsRead)

export default conversationsRouter
