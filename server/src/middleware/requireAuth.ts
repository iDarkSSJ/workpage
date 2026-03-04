import { Request, Response, NextFunction } from "express"
import { auth } from "../auth/auth"
import { fromNodeHeaders } from "better-auth/node"

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionContext = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    if (!sessionContext?.session) {
      res.status(401).json({ error: "Unauthorized" })
      return
    }

    req.session = sessionContext
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
