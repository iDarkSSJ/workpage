import z from "zod"
const urlField = (msg: string, domain?: string) =>
  z
    .union([
      z.literal(""),
      z.url(msg).refine(
        (url) => {
          if (!domain) return true
          const stripped = url.replace(/^https?:\/\//, "").replace(/^www\./, "")
          return stripped.startsWith(domain)
        },
        { message: msg },
      ),
    ])
    .optional()

export const experienceItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El cargo es obligatorio."),
  company: z.string().min(1, "La empresa es obligatoria."),
  description: z.string().optional(),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
  endDate: z.string().optional(),
})

export const certificationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "El nombre de la certificación es obligatorio."),
  institution: z.string().min(1, "La institución es obligatoria."),
  issuedDate: z.string().optional(),
  url: urlField("No es una URL válida."),
})

export const portfolioItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "El título del proyecto es obligatorio."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  projectUrl: urlField("No es una URL válida."),
})

export const freelancerProfileSchema = z.object({
  bio: z.string().optional(),
  category: z.string().optional(),
  hourlyRate: z.string().optional(),
  country: z.string().optional(),
  linkedinUrl: urlField("No es una URL de LinkedIn válida.", "linkedin.com"),
  githubUrl: urlField("No es una URL de GitHub válida.", "github.com"),
  websiteUrl: urlField("No es una URL válida."),
  skills: z.array(z.string()).optional(),
  experiences: z.array(experienceItemSchema).optional(),
  certifications: z.array(certificationItemSchema).optional(),
  portfolio: z.array(portfolioItemSchema).optional(),
})

export const contractorProfileSchema = z.object({
  companyName: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  websiteUrl: urlField("No es una URL válida."),
})
