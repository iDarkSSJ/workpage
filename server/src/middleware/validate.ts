import { Request, NextFunction, Response } from "express"
import { ZodArray, ZodObject } from "zod"

// Y si paseAsync nos tira un error, sera interceptado por el middleware de errores.
// errorHandler -> validate -> router -> controller -> service -> database

// Vamos a pedir como parametro el schema de zod que queremos validar.
export const validate =
  (schema: ZodObject | ZodArray) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {

        req.body = await schema.parseAsync(req.body)
        next()
      } catch (error) {
        next(error)
      }
    }
