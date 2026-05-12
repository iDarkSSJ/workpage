import { z } from "zod"

export const queryProjectsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  minBudget: z.coerce.number().positive().optional(),
  maxBudget: z.coerce.number().positive().optional(),
  skillId: z.uuid().optional(),
})

export const createProjectSchema = z.object({
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().min(20).max(5000),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z.coerce.number().positive().transform(String),
  budgetMax: z.coerce.number().positive().transform(String),
  skills: z.array(z.uuid()).min(1).max(15),
})

export const updateProjectStatusSchema = z.object({
  status: z.literal("closed"),
})

export type QueryProjectsData = z.infer<typeof queryProjectsSchema>
export type CreateProjectData = z.infer<typeof createProjectSchema>
