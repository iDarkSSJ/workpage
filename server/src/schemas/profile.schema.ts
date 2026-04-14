import { z } from "zod"
import countries from "../data/countries.json"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const countryCodes = countries.map((c) => c.code)

// Aquellos campos que pueden ser vacios. los mandamos al service como null.

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

// ─── Schemas ─────────────────────────────────────────────────────────────────

export const freelancerSchema = z.object({
  bio: optionalString(1000),
  category: optionalString(50),
  hourlyRate: z
    .number()
    .positive("La tarifa debe ser mayor a 0")
    .max(500000, "La tarifa excede el límite permitido")
    .optional()
    .nullable()
    .transform((v) => (v != null ? String(v) : null)),
  country: z.enum(countryCodes),
  linkedinUrl: optionalUrl,
  githubUrl: optionalUrl,
  websiteUrl: optionalUrl,
  skills: z.array(z.uuid()).max(15, "Máximo 15 habilidades").optional(),
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
  issuedDate: z.coerce.date().max(new Date(), "No mayor a la fecha actual"),
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

export const contractorSchema = z.object({
  companyName: optionalString(100),
  bio: optionalString(1000),
  country: optionalString(50),
  websiteUrl: optionalUrl,
})

// ─── Types ───────────────────────────────────────────────────────────────────

export type FreelancerProfileData = z.infer<typeof freelancerSchema>
export type ContractorProfileData = z.infer<typeof contractorSchema>
export type ExperienceData = z.infer<typeof experienceSchema>
export type CertificationData = z.infer<typeof certificationSchema>
export type PortfolioData = z.infer<typeof portfolioSchema>
