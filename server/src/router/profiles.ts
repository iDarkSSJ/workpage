import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"

const router = Router()

// SCHEMAS - jose luis
const freelancerSchema = z.object({
  bio: z.string().optional(),
  category: z.string().optional(),
  hourlyRate: z.number().optional().or(z.string().transform(Number).optional()),
  country: z.string().optional(),
  linkedinUrl: z.url().optional().or(z.literal("")),
  githubUrl: z.url().optional().or(z.literal("")),
  websiteUrl: z.url().optional().or(z.literal("")),
})

const contractorSchema = z.object({
  companyName: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  websiteUrl: z.url().optional().or(z.literal("")),
})

// FREELANCERS

router.get("/freelancers/:id", async (req, res) => {
  try {
    const profile = await db.query.freelancerProfile.findFirst({
      where: eq(schema.freelancerProfile.id, req.params.id as string),
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

    const [newProfile] = await db
      .insert(schema.freelancerProfile)
      .values({
        id: crypto.randomUUID(),
        userId: req.session!.user.id,
        ...parsed,
        hourlyRate: parsed.hourlyRate ? String(parsed.hourlyRate) : null,
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
// actualizar perfil de freelancer
router.put("/freelancers/me", requireAuth, async (req: Request, res) => {
  try {
    const parsed = freelancerSchema.parse(req.body)

    const [updatedProfile] = await db
      .update(schema.freelancerProfile)
      .set({
        ...parsed,
        hourlyRate: parsed.hourlyRate ? String(parsed.hourlyRate) : null,
      })
      .where(eq(schema.freelancerProfile.userId, req.session!.user.id))
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

// --- CONTRACTORS ---

// endpoint publico
// obtener perfil de contratista
router.get("/contractors/:id", async (req, res) => {
  try {
    const profile = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.id, req.params.id as string),
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

    const [updatedProfile] = await db
      .update(schema.contractorProfile)
      .set(parsed)
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
