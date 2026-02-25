import { Request, Response, NextFunction } from "express"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../auth/auth"

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!session) {
      return res.status(401).json({ error: "No autorizado" })
    }

    req.session = session
    next()
  } catch (err) {
    return res.status(500).json({ error: "Error de autenticación" })
  }
}
