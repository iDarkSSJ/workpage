import { NextFunction, Response, Request } from "express"
import z, { ZodError } from "zod"
import { AppError } from "../utils/AppError"

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message })
  }

  if (err instanceof ZodError) {
  const cause: any = z.treeifyError(err)
  const fields = Object.values(cause.properties ?? {}) as any[]

  const errorMessage = cause.errors[0] ?? fields[0]?.errors[0] ?? "Error validando los datos."

  return res.status(400).json({ error: errorMessage })
}

  console.error("Error interno del servidor:", err.message)
  return res.status(500).json({ error: "Error interno del servidor" })
}
