import { z } from "zod"

export const createProposalSchema = z.object({
  coverLetter: z.string().trim().min(10, "La carta de presentación debe tener al menos 10 caracteres").max(5000),
  bidAmount: z.coerce.number("El monto debe ser un número").positive("El monto debe ser positivo").transform(String),
  bidType: z.enum(["fixed", "hourly"]),
})

export const updateProposalStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "withdrawn", "pending"]),
})

export type CreateProposalData = z.infer<typeof createProposalSchema>
export type UpdateProposalStatusData = z.infer<typeof updateProposalStatusSchema>
