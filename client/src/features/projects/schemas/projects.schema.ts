import { z } from "zod"

export const queryProjectsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  minBudget: z.coerce.number().positive().optional(),
  maxBudget: z.coerce.number().positive().optional(),
  skillId: z.uuid().optional(),
})

export const createProjectSchema = z.object({
  title: z
    .string("El título es requerido")
    .trim()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título debe tener menos de 100 caracteres"),
  description: z
    .string("La descripción es requerida")
    .trim()
    .min(20, "La descripción debe tener al menos 20 caracteres")
    .max(5000, "La descripción debe tener menos de 5000 caracteres"),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z
    .coerce.number("El presupuesto mínimo debe ser un número")
    .positive("El presupuesto mínimo debe ser mayor a 0")
    .transform(String),
  budgetMax: z
    .coerce.number("El presupuesto máximo debe ser un número")
    .positive("El presupuesto máximo debe ser mayor a 0")
    .transform(String),
  skills: z
    .array(z.uuid())
    .min(1, "Debes seleccionar al menos una habilidad")
    .max(15, "Debes seleccionar menos de 15 habilidades"),
})

export const updateProjectStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "closed", "completed"]),
})

export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectStatusData = z.infer<typeof updateProjectStatusSchema>
