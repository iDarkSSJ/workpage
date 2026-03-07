import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, or, and, desc, isNull, ne } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

const router = Router()

const createConversationSchema = z.object({
  receiverId: z.string(),
  projectId: z.string().optional(),
})

const sendMessageSchema = z.object({
  content: z.string().min(1),
})

// GET /conversations
router.get("/", requireAuth, async (req: Request, res) => {
  try {
    const userId = req.session!.user.id
    const conversations = await db.query.conversation.findMany({
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

    res.json(conversations)
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// POST /conversations
router.post("/", requireAuth, async (req: Request, res) => {
  try {
    const parsed = createConversationSchema.parse(req.body)
    const userId = req.session!.user.id

    if (userId === parsed.receiverId) {
      res
        .status(400)
        .json({ error: "No puedes iniciar una conversación contigo mismo" })
      return
    }

    // Aqui ordenamos los ids de los usuarios de manera que el id que sea menor lexicográficamente sea pA y el mayor pB
    // o sea orden alfabético
    // para evitar duplicados de conversaciones
    const [pA, pB] = [userId, parsed.receiverId].sort() // array sorted lexicographically

    const conditions = [
      eq(schema.conversation.participantAId, pA),
      eq(schema.conversation.participantBId, pB),
    ]

    if (parsed.projectId) {
      conditions.push(eq(schema.conversation.projectId, parsed.projectId))
    } else {
      // En caso de que se este creando una conversación sin proyecto, buscamos las conversaciones sin proyecto que tengan los mismos usuarios
      // asi que agregamos la condicion de que el projectId sea null
      // para evitar que se creen conversaciones duplicadas de ambos tipos de iniciacion -jose luis
      conditions.push(isNull(schema.conversation.projectId))
    }

    const existing = await db.query.conversation.findFirst({
      where: and(...conditions),
    })

    if (existing) {
      res.json(existing)
      return
    }

    const [newConversation] = await db
      .insert(schema.conversation)
      .values({
        id: crypto.randomUUID(),
        projectId: parsed.projectId || null,
        participantAId: pA,
        participantBId: pB,
      })
      .returning()

    res.status(201).json(newConversation)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Datos invalidos" })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// GET /conversations/:id/messages
router.get("/:id/messages", requireAuth, async (req: Request, res) => {
  try {
    const { offset = "0" } = req.query

    const limitNum = 20
    const offsetNum = parseInt(offset as string, 10)

    const conversation = await db.query.conversation.findFirst({
      where: eq(schema.conversation.id, req.params.id as string),
    })

    if (!conversation) {
      res.status(404).json({ error: "Conversacion no encontrada" })
      return
    }

    if (
      conversation.participantAId !== req.session!.user.id &&
      conversation.participantBId !== req.session!.user.id
    ) {
      res.status(403).json({
        error: "No eres un participante en esta conversacion",
      })
      return
    }

    // Obtenemos los mensajes de la conversacion ordenados por la fecha de su mensaje mas reciente.
    const messages = await db.query.message.findMany({
      where: eq(schema.message.conversationId, conversation.id),
      orderBy: [desc(schema.message.createdAt)],
      limit: limitNum,
      offset: offsetNum,
    })

    res.json({
      data: messages,
      limit: limitNum,
      offset: offsetNum,
    })
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// POST /conversations/:id/messages
router.post("/:id/messages", requireAuth, async (req: Request, res) => {
  try {
    const parsed = sendMessageSchema.parse(req.body)

    const conversation = await db.query.conversation.findFirst({
      where: eq(schema.conversation.id, req.params.id as string),
    })

    if (!conversation) {
      res.status(404).json({ error: "Conversacion no encontrada" })
      return
    }

    if (
      conversation.participantAId !== req.session!.user.id &&
      conversation.participantBId !== req.session!.user.id
    ) {
      res
        .status(403)
        .json({ error: "No eres un participante en esta conversacion" })
      return
    }

    const [newMessage] = await db
      .insert(schema.message)
      .values({
        id: crypto.randomUUID(),
        conversationId: conversation.id,
        senderId: req.session!.user.id,
        content: parsed.content,
        isRead: false,
      })
      .returning()

    // actualizamos la fecha de actualizacion de la conversacion
    await db
      .update(schema.conversation)
      .set({ updatedAt: new Date() })
      .where(eq(schema.conversation.id, conversation.id))

    res.status(201).json(newMessage)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Datos invalidos" })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// PUT /conversations/:id/messages/read
router.put("/:id/messages/read", requireAuth, async (req: Request, res) => {
  try {
    const conversation = await db.query.conversation.findFirst({
      where: eq(schema.conversation.id, req.params.id as string),
    })

    if (!conversation) {
      res.status(404).json({ error: "Conversacion no encontrada" })
      return
    }

    if (
      conversation.participantAId !== req.session!.user.id &&
      conversation.participantBId !== req.session!.user.id
    ) {
      res
        .status(403)
        .json({ error: "No eres un participante en esta conversacion" })
      return
    }

    // Actualizamos a isRead = true los mensajes de la conversacion que NO hayan sido enviados por el usuario recien autenticado
    await db
      .update(schema.message)
      .set({ isRead: true })
      .where(
        and(
          eq(schema.message.conversationId, conversation.id),
          ne(schema.message.senderId, req.session!.user.id),
          eq(schema.message.isRead, false),
        ),
      )

    res
      .status(200)
      .json({ success: true, message: "Mensajes marcados como leidos" })
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router
