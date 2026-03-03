import { NextFunction, Request, Response } from "express"

export function requireCompletedProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.session?.user?.role) {
    return res.status(403).json({
      error: "perfil incompleto",
    })
  }

  next()
}
