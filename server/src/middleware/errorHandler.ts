import { NextFunction, Response, Request } from "express"
import { ZodError } from "zod"
import { AppError } from "../utils/AppError"

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Error validando los datos.",
    })
  }

  console.error("Error interno del servidor:", err.message)
  return res.status(500).json({ error: "Error interno del servidor" })
}
