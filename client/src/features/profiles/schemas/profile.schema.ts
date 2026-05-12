import { z } from "zod"
import countries from "../../../data/countries.json"

const countryCodes = countries.map((c) => c.code)

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo ${max} caracteres`)
    .optional()
    .nullable()
    .transform((val) => (val === "" ? null : val))

const optionalUrl = z
  .union([z.url("Debe ser una URL válida"), z.literal("")])
  .optional()
  .nullable()
  .transform((val) => (val === "" ? null : val))

export const updateFreelancerSchema = z.object({
  bio: z.string().min(10, "La biografía debe ser más detallada"),
  category: z.string().min(2, "Selecciona una categoría válida"),
  hourlyRate: z.coerce
    .number("La tarifa debe ser un número")
    .min(5, "La tarifa mínima es $5 USD"),
  country: z.enum(countryCodes, "Selecciona un país"),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  skills: z
    .array(z.string().uuid())
    .max(15, "Máximo 15 habilidades")
    .optional(),
})

export const updateContractorSchema = z.object({
  companyName: z.string().min(2, "El nombre de la empresa es obligatorio"),
  bio: z.string().min(10, "Cuéntanos más sobre tu empresa"),
  country: z.enum(countryCodes, "Selecciona un país"),
  websiteUrl: optionalUrl,
})

export const experienceSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Obligatorio")
      .max(100, "Máximo 100 caracteres"),
    company: z
      .string()
      .trim()
      .min(1, "Obligatorio")
      .max(100, "Máximo 100 caracteres"),
    description: optionalString(1000),
    startDate: z.coerce
      .date("Fecha inválida")
      .max(new Date(), "No mayor a la fecha actual"),
    endDate: z.preprocess(
      (val) => (val === "" ? null : val),
      z.coerce.date("Fecha inválida").nullable().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (!data.endDate) return

    if (data.endDate > new Date()) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de fin no puede ser en el futuro",
        path: ["endDate"],
      })
    } else if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: "custom",
        message: "La fecha de inicio no puede ser posterior a la de fin",
        path: ["startDate"],
      })
    }
  })

export const certificationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Obligatorio")
    .max(100, "Máximo 100 caracteres"),
  institution: z
    .string()
    .trim()
    .min(1, "Obligatorio")
    .max(100, "Máximo 100 caracteres"),
  issuedDate: z.coerce
    .date("Fecha inválida")
    .max(new Date(), "No mayor a la fecha actual"),
  url: optionalUrl,
})

export const portfolioSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Obligatorio")
    .max(100, "Máximo 100 caracteres"),
  description: optionalString(1000),
  imageUrl: optionalUrl,
  projectUrl: optionalUrl,
})

export type ExperienceData = z.infer<typeof experienceSchema>
export type CertificationData = z.infer<typeof certificationSchema>
export type PortfolioData = z.infer<typeof portfolioSchema>

export type UpdateFreelancerData = z.infer<typeof updateFreelancerSchema>
export type UpdateContractorData = z.infer<typeof updateContractorSchema>
