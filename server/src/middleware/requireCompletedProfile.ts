import { NextFunction, Request, Response } from "express"

export function requireCompletedProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = req.session as (typeof req.session & { user: { role?: string } }) | undefined
  const user = session?.user

  if (!user?.role) {
    return res.status(403).json({
      error: "perfil incompleto",
    })
  }

  next()
}
