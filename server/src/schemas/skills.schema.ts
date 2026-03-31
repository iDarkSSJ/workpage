import { z } from "zod"

export const createSkillSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre no puede exceder los 40 caracteres"),
})

export const skillQuerySchema = z.object({
  q: z.string().trim().optional(),
})