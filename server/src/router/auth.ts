import { Request, Response, Router } from "express"
import { db } from "../database/database"
import { auth } from "../auth/auth"
import { fromNodeHeaders } from "better-auth/node"
import { requireAuth } from "../middleware/auth.middleware"
import z from "zod"
import { eq } from "drizzle-orm"
import * as authSchema from "../database/auth-schema"
import express from "express"

const authRouter = Router()

type ApiResponse = { success: true } | { error: string }

// Handler to initiate account deletion and prevent email abuse - jose
authRouter.post(
  "/delete-account",
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      // 1️ - Get Session - jose
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      })

      if (!session?.user) {
        return res.status(401).json({
          error: "No autorizado",
        })
      }

      const user = session.user

      // 2 - Verify if exits an active request - jose
      const existing = await db.query.verification.findFirst({
        where: (v, { and, eq, like, gt }) =>
          and(
            eq(v.value, user.id),
            like(v.identifier, "delete-account-%"),
            gt(v.expiresAt, new Date()),
          ),
      })

      if (existing) {
        return res.status(400).json({
          error: "Ya existe una solicitud de eliminación activa",
        })
      }

      // 3- if not exists an active request then call better auth.
      const { success } = await auth.api.deleteUser({
        headers: req.headers as any,
        body: {
          callbackURL: process.env.CLIENT_URL,
        },
      })

      if (!success) {
        return res.status(500).json({
          error: "Error interno del servidor",
        })
      }

      return res.status(200).json({ success: true })
    } catch (err) {
      console.error("Delete account error:", err)

      return res.status(500).json({
        error: "Error interno del servidor",
      })
    }
  },
)

authRouter.post(
  "/complete-profile",
  requireAuth,
  express.json(),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const roleSchema = z.enum(["contractor", "freelance"])

      const { role } = req.body

      const result = roleSchema.safeParse(req.body.role)

      if (!result.success) {
        return res.status(400).json({
          error: "Rol Invalido",
        })
      }

      // Verify if the user actually does not have a role yet.
      const userId = req.session!.user.id

      const user = await db.query.user.findFirst({
        where: eq(authSchema.user.id, userId),
      })

      if (!user) {
        return res.status(404).json({ error: "No se encontró el usuario" })
      }

      if (user.role) {
        return res.status(409).json({
          error: "Este perfil ya esta completo",
        })
      }

      const { rowCount } = await db
        .update(authSchema.user)
        .set({ role })
        .where(eq(authSchema.user.id, req.session!.user.id))

      if (rowCount < 1) {
        return res.status(500).json({
          error: "Error interno del servidor",
        })
      }
      return res.json({ success: true })
    } catch (err) {
      console.error("Complete profile error:", err)
      return res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

authRouter.post(
  "/request-email-verification",
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      })

      if (!session?.user) {
        return res.status(401).json({ error: "No autorizado" })
      }

      const identifier = `verify-email-${session.user.id}`

      const existing = await db.query.verification.findFirst({
        where: (v, { and, eq, gt }) =>
          and(eq(v.identifier, identifier), gt(v.expiresAt, new Date())),
      })

      if (existing) {
        const minutesLeft = Math.ceil(
          (existing.expiresAt.getTime() - Date.now()) / 1000 / 60,
        )

        return res.status(400).json({
          error: `Espera ${minutesLeft} minuto(s) antes de reenviar.`,
        })
      }

      const { rowCount } = await db.insert(authSchema.verification).values({
        id: crypto.randomUUID(),
        identifier,
        value: session.user.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      if (rowCount < 1) {
        return res.status(500).json({
          error: "Error interno del servidor",
        })
      }

      const { status } = await auth.api.sendVerificationEmail({
        headers: req.headers as any,
        body: {
          email: session.user.email,
          callbackURL: process.env.CLIENT_URL,
        },
      })

      if (!status) {
        return res.status(500).json({
          error: "Error interno del servidor",
        })
      }

      return res.json({ success: true })
    } catch (err) {
      console.error("Request verifying error:", err)
      return res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

export default authRouter
