import { Request, Response, Router } from "express"
import { db } from "../database/database"
import { auth } from "../auth/auth"
import { fromNodeHeaders } from "better-auth/node"
import z from "zod"
import { eq } from "drizzle-orm"
import * as authSchema from "../database/auth-schema"
import express from "express"
import { requireAuth } from "../middleware/requireAuth"
import crypto from "crypto"

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

      // 2 - Verify if exists an active request - jose
      // Check for the latest record created in the last 5 minutes
      const existing = await db.query.verification.findFirst({
        where: (v, { and, eq, like }) =>
          and(eq(v.value, user.id), like(v.identifier, "delete-account-%")),
        orderBy: (v, { desc }) => [desc(v.createdAt)],
      })

      if (existing) {
        const diff = Date.now() - existing.createdAt.getTime()
        const fiveMinutes = 5 * 60 * 1000

        if (diff < fiveMinutes) {
          const minutesLeft = Math.ceil((fiveMinutes - diff) / 60000)
          return res.status(400).json({
            error: `Ya existe una solicitud activa. Espera ${minutesLeft} minuto(s).`,
          })
        }
      }

      // 3- if not exists an active request then call better auth.
      const { success } = await auth.api.deleteUser({
        headers: fromNodeHeaders(req.headers),
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

      const dbResult = await db
        .update(authSchema.user)
        .set({ role })
        .where(eq(authSchema.user.id, req.session!.user.id))

      if ((dbResult?.rowCount ?? 0) < 1) {
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
        where: (v, { and, eq }) => and(eq(v.identifier, identifier)),
        orderBy: (v, { desc }) => [desc(v.createdAt)],
      })

      if (existing) {
        const diff = Date.now() - existing.createdAt.getTime()
        const fiveMinutes = 5 * 60 * 1000

        if (diff < fiveMinutes) {
          const minutesLeft = Math.ceil((fiveMinutes - diff) / 60000)
          return res.status(400).json({
            error: `Espera ${minutesLeft} minuto(s) antes de reenviar el enlace de verificación.`,
          })
        }
      }

      const result = await db.insert(authSchema.verification).values({
        id: crypto.randomUUID(),
        identifier,
        value: session.user.email,
        expiresAt: new Date(Date.now() + 1000 * 60 * 5),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      if ((result?.rowCount ?? 0) < 1) {
        return res.status(500).json({
          error: "Error interno del servidor",
        })
      }

      const { status } = await auth.api.sendVerificationEmail({
        headers: fromNodeHeaders(req.headers),
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

authRouter.post(
  "/request-password-reset",
  express.json(),
  async (req: Request, res: Response<ApiResponse>) => {
    try {
      const { email } = req.body
      if (!email) return res.status(400).json({ error: "Email requerido" })

      // 1. Find the user first to get their ID for the cooldown check
      const user = await db.query.user.findFirst({
        where: eq(authSchema.user.email, email),
      })

      if (!user) {
        return res.json({ success: true })
      }

      const existing = await db.query.verification.findFirst({
        where: (v, { and, eq, like }) =>
          and(eq(v.value, user.id), like(v.identifier, "reset-password:%")),
        orderBy: (v, { desc }) => [desc(v.createdAt)],
      })

      if (existing) {
        const diff = Date.now() - existing.createdAt.getTime()
        const fiveMinutes = 5 * 60 * 1000

        if (diff < fiveMinutes) {
          const minutesLeft = Math.ceil((fiveMinutes - diff) / 60000)
          return res.status(400).json({
            error: `Espera ${minutesLeft} minuto(s) antes de reenviar el enlace de restauración.`,
          })
        }
      }

      const { status } = await auth.api.requestPasswordReset({
        headers: fromNodeHeaders(req.headers),
        body: {
          email,
          redirectTo: `${process.env.CLIENT_URL}/reset-password`,
        },
      })

      if (!status) {
        return res
          .status(500)
          .json({ error: "Error al solicitar restauración" })
      }

      return res.json({ success: true })
    } catch (err) {
      console.error("Request password reset error:", err)
      return res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

export default authRouter
