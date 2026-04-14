import { z } from "zod"

export const createProposalSchema = z.object({
  coverLetter: z.string().trim().min(10).max(5000),
  bidAmount: z.coerce.number().positive().transform(String),
  bidType: z.enum(["fixed", "hourly"]),
})

export const updateProposalStatusSchema = z.object({
  status: z.enum(["accepted", "rejected", "withdrawn", "pending"]),
})

export type CreateProposalData = z.infer<typeof createProposalSchema>
