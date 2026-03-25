import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and, ilike, inArray } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

const router = Router()

// --- Schemas por sección ---

const freelancerSchema = z.object({
  bio: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  hourlyRate: z
    .number()
    .optional()
    .or(z.string().transform(Number).optional())
    .nullable(),
  country: z.string().optional().nullable(),
  linkedinUrl: z.url().optional().or(z.literal("")).nullable(),
  githubUrl: z.url().optional().or(z.literal("")).nullable(),
  websiteUrl: z.url().optional().or(z.literal("")).nullable(),
  skills: z.array(z.string()).optional(),
})

const experienceSchema = z.object({
  title: z.string(),
  company: z.string(),
  description: z.string().optional().nullable(),
  startDate: z.string(),
  endDate: z.string().optional().nullable(),
})

const certificationSchema = z.object({
  name: z.string(),
  institution: z.string(),
  issuedDate: z.string().optional().nullable(),
  url: z.string().url().optional().or(z.literal("")).nullable(),
})

const portfolioSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  projectUrl: z.string().url().optional().or(z.literal("")).nullable(),
})

const contractorSchema = z.object({
  companyName: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  websiteUrl: z.string().url().optional().or(z.literal("")).nullable(),
})

// GET /profiles/me — ambos perfiles (freelancer + contratante) del usuario logueado
router.get("/me", requireAuth, async (req: Request, res) => {
  try {
    const userId = req.session!.user.id

    const [freelancerProfile, contractorProfile] = await Promise.all([
      db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, userId),
        with: {
          skills: { with: { skill: true } },
          experiences: true,
          certifications: true,
          featuredProjects: true,
        },
      }),
      db.query.contractorProfile.findFirst({
        where: eq(schema.contractorProfile.userId, userId),
      }),
    ])

    res.json({
      freelancerProfile: freelancerProfile ?? null,
      contractorProfile: contractorProfile ?? null,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// FREELANCERS

router.get("/freelancers/:id", async (req, res) => {
  try {
    const id = req.params.id as string
    if (!z.uuid().safeParse(id).success) {
      res.status(404).json({ error: "Freelancer no encontrado" })
      return
    }

    const profile = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.id, id),
      // relaciones automaticas gracias a relations() schema en server\src\database\schema\**.ts
      with: {
        user: {
          columns: { name: true, image: true, email: true },
        },
        skills: {
          with: { skill: true },
        },
        experiences: true,
        certifications: true,
        featuredProjects: true,
      },
    })

    if (!profile) {
      res.status(404).json({ error: "Freelancer no encontrado" })
      return
    }

    // Reviews que los contratantes dejaron a este freelancer
    const reviews = await db.query.review.findMany({
      where: and(
        eq(schema.review.revieweeId, profile.userId),
        eq(schema.review.revieweeRole, "freelancer"),
      ),
      with: {
        reviewer: {
          columns: { name: true, image: true },
        },
      },
    })

    res.json({ ...profile, reviews })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// endpoint protegido con middleware
// crear perfil de freelancer
router.post("/freelancers/me", requireAuth, async (req: Request, res) => {
  try {
    const parsed = freelancerSchema.parse(req.body)

    const existing = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.userId, req.session!.user.id),
    })

    if (existing) {
      res.status(400).json({ error: "El perfil ya existe." })
      return
    }

    const { skills, ...baseProfile } = parsed
    const newProfileId = crypto.randomUUID()

    const newProfile = await db.transaction(async (tx) => {
      // 1. Insert Profile
      const [insertedProfile] = await tx
        .insert(schema.freelancerProfile)
        .values({
          id: newProfileId,
          userId: req.session!.user.id,
          ...baseProfile,
          hourlyRate: baseProfile.hourlyRate
            ? String(baseProfile.hourlyRate)
            : null,
        })
        .returning()

      // 2. Insert Skills
      if (skills && skills.length > 0) {
        await tx.insert(schema.freelancerSkill).values(
          skills.map((skillId) => ({
            freelancerId: newProfileId,
            skillId,
          })),
        )
      }

      return insertedProfile
    })

    res.status(201).json(newProfile)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del perfil." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// endpoint protegido con middleware
// actualizar solo campos base + skills del freelancer
router.put("/freelancers/me", requireAuth, async (req: Request, res) => {
  try {
    const parsed = freelancerSchema.parse(req.body)

    const existingProfile = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.userId, req.session!.user.id),
      columns: { id: true },
    })

    if (!existingProfile) {
      res.status(404).json({ error: "Perfil no encontrado" })
      return
    }

    const { skills, ...baseProfile } = parsed

    const updatedProfile = await db.transaction(async (tx) => {
      const [upProfile] = await tx
        .update(schema.freelancerProfile)
        .set({
          ...baseProfile,
          hourlyRate: baseProfile.hourlyRate
            ? String(baseProfile.hourlyRate)
            : null,
        })
        .where(eq(schema.freelancerProfile.userId, req.session!.user.id))
        .returning()

      await tx
        .delete(schema.freelancerSkill)
        .where(eq(schema.freelancerSkill.freelancerId, existingProfile.id))
      if (skills && skills.length > 0) {
        await tx.insert(schema.freelancerSkill).values(
          skills.map((skillId) => ({
            freelancerId: existingProfile.id,
            skillId,
          })),
        )
      }

      return upProfile
    })

    res.json(updatedProfile)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del perfil." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// endpoint protegido con middleware
// crear experiencias del freelancer
router.post(
  "/freelancers/me/experiences",
  requireAuth,
  async (req: Request, res) => {
    try {
      const items = z.array(experienceSchema).parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const inserted = await db
        .insert(schema.freelancerExperience)
        .values(
          items.map((exp) => ({
            id: crypto.randomUUID(),
            freelancerId: profile.id,
            title: exp.title,
            company: exp.company,
            description: exp.description || null,
            startDate: exp.startDate,
            endDate: exp.endDate || null,
          })),
        )
        .returning()

      res.status(201).json(inserted)
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.delete(
  "/freelancers/me/experiences/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const deleted = await db
        .delete(schema.freelancerExperience)
        .where(
          and(
            eq(schema.freelancerExperience.id, req.params.id as string),
            eq(schema.freelancerExperience.freelancerId, profile.id),
          ),
        )
        .returning()

      if (deleted.length === 0) {
        res.status(404).json({ error: "Experiencia no encontrada" })
        return
      }
      res.json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.patch(
  "/freelancers/me/experiences/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const data = experienceSchema.parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const updated = await db
        .update(schema.freelancerExperience)
        .set({
          title: data.title,
          company: data.company,
          description: data.description || null,
          startDate: data.startDate,
          endDate: data.endDate || null,
        })
        .where(
          and(
            eq(schema.freelancerExperience.id, req.params.id as string),
            eq(schema.freelancerExperience.freelancerId, profile.id),
          ),
        )
        .returning()

      if (updated.length === 0) {
        res
          .status(404)
          .json({ error: "Experiencia no encontrada o no autorizada" })
        return
      }
      res.json(updated[0])
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.post(
  "/freelancers/me/certifications",
  requireAuth,
  async (req: Request, res) => {
    try {
      const items = z.array(certificationSchema).parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const inserted = await db
        .insert(schema.freelancerCertification)
        .values(
          items.map((cert) => ({
            id: crypto.randomUUID(),
            freelancerId: profile.id,
            name: cert.name,
            institution: cert.institution,
            issuedDate: cert.issuedDate || null,
            url: cert.url || null,
          })),
        )
        .returning()

      res.status(201).json(inserted)
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.delete(
  "/freelancers/me/certifications/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const deleted = await db
        .delete(schema.freelancerCertification)
        .where(
          and(
            eq(schema.freelancerCertification.id, req.params.id as string),
            eq(schema.freelancerCertification.freelancerId, profile.id),
          ),
        )
        .returning()

      if (deleted.length === 0) {
        res.status(404).json({ error: "Certificación no encontrada" })
        return
      }
      res.json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.patch(
  "/freelancers/me/certifications/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const data = certificationSchema.parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const updated = await db
        .update(schema.freelancerCertification)
        .set({
          name: data.name,
          institution: data.institution,
          issuedDate: data.issuedDate || null,
          url: data.url || null,
        })
        .where(
          and(
            eq(schema.freelancerCertification.id, req.params.id as string),
            eq(schema.freelancerCertification.freelancerId, profile.id),
          ),
        )
        .returning()

      if (updated.length === 0) {
        res
          .status(404)
          .json({ error: "Certificación no encontrada o no autorizada" })
        return
      }
      res.json(updated[0])
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)


router.post(
  "/freelancers/me/portfolio",
  requireAuth,
  async (req: Request, res) => {
    try {
      const items = z.array(portfolioSchema).parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const inserted = await db
        .insert(schema.featuredProject)
        .values(
          items.map((port) => ({
            id: crypto.randomUUID(),
            freelancerId: profile.id,
            title: port.title,
            description: port.description || null,
            imageUrl: port.imageUrl || null,
            projectUrl: port.projectUrl || null,
          })),
        )
        .returning()

      res.status(201).json(inserted)
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.delete(
  "/freelancers/me/portfolio/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const deleted = await db
        .delete(schema.featuredProject)
        .where(
          and(
            eq(schema.featuredProject.id, req.params.id as string),
            eq(schema.featuredProject.freelancerId, profile.id),
          ),
        )
        .returning()

      if (deleted.length === 0) {
        res.status(404).json({ error: "Proyecto no encontrado" })
        return
      }
      res.json({ success: true })
    } catch (error) {
      console.error(error)
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

router.patch(
  "/freelancers/me/portfolio/:id",
  requireAuth,
  async (req: Request, res) => {
    try {
      const data = portfolioSchema.parse(req.body)
      const profile = await db.query.freelancerProfile.findFirst({
        where: eq(schema.freelancerProfile.userId, req.session!.user.id),
        columns: { id: true },
      })
      if (!profile) {
        res.status(404).json({ error: "Perfil no encontrado" })
        return
      }

      const updated = await db
        .update(schema.featuredProject)
        .set({
          title: data.title,
          description: data.description || null,
          imageUrl: data.imageUrl || null,
          projectUrl: data.projectUrl || null,
        })
        .where(
          and(
            eq(schema.featuredProject.id, req.params.id as string),
            eq(schema.featuredProject.freelancerId, profile.id),
          ),
        )
        .returning()

      if (updated.length === 0) {
        res
          .status(404)
          .json({ error: "Proyecto no encontrado o no autorizado" })
        return
      }
      res.json(updated[0])
    } catch (error) {
      console.error(error)
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Datos inválidos" })
        return
      }
      res.status(500).json({ error: "Error interno del servidor" })
    }
  },
)

// --- CONTRACTORS ---

// endpoint publico
// obtener perfil de contratista
router.get("/contractors/:id", async (req, res) => {
  try {
    const id = req.params.id as string
    if (!z.string().uuid().safeParse(id).success) {
      res.status(404).json({ error: "Contratista no encontrado" })
      return
    }

    const profile = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.id, id),
      with: {
        user: {
          columns: { name: true, image: true, email: true },
        },
      },
    })

    if (!profile) {
      res.status(404).json({ error: "Contratista no encontrado" })
      return
    }

    // Reviews que los freelancers dejaron a este contratante
    const reviews = await db.query.review.findMany({
      where: and(
        eq(schema.review.revieweeId, profile.userId),
        eq(schema.review.revieweeRole, "contractor"),
      ),
      with: {
        reviewer: {
          columns: { name: true, image: true },
        },
      },
    })

    res.json({ ...profile, reviews })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// endpoint protegido con middleware
// crear perfil de contratista
router.post("/contractors/me", requireAuth, async (req: Request, res) => {
  try {
    const parsed = contractorSchema.parse(req.body)

    const existing = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.userId, req.session!.user.id),
    })

    if (existing) {
      res.status(400).json({ error: "El perfil ya existe." })
      return
    }

    const [newProfile] = await db
      .insert(schema.contractorProfile)
      .values({
        id: crypto.randomUUID(),
        userId: req.session!.user.id,
        ...parsed,
      })
      .returning()

    res.status(201).json(newProfile)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del perfil." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

// endpoint protegido con middleware
// actualizar perfil de contratista
router.put("/contractors/me", requireAuth, async (req: Request, res) => {
  try {
    const parsed = contractorSchema.parse(req.body)

    const payload = Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k, v === "" ? null : v]),
    )

    const [updatedProfile] = await db
      .update(schema.contractorProfile)
      .set(payload)
      .where(eq(schema.contractorProfile.userId, req.session!.user.id))
      .returning()

    if (!updatedProfile) {
      res.status(404).json({ error: "Perfil no encontrado" })
      return
    }

    res.json(updatedProfile)
  } catch (error) {
    console.error(error)
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del perfil." })
      return
    }
    res.status(500).json({ error: "Error interno del servidor" })
  }
})

export default router
