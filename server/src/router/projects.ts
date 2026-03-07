import { Router } from "express"
import { requireAuth } from "../middleware/requireAuth"
import { Request } from "express"
import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm"
import { z } from "zod"
import crypto from "crypto"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../auth/auth"

const router = Router()

// SCHEMAS
const createProjectSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(20),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z.number().optional().or(z.string().transform(Number).optional()),
  budgetMax: z.number().optional().or(z.string().transform(Number).optional()),
  skills: z.array(z.string()).optional(),
})

const updateProjectStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "closed", "completed"]),
})

const queryProjectsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  minBudget: z.coerce.number().optional(),
  maxBudget: z.coerce.number().optional(),
  skillId: z.string().optional(),
})

// ENDPOINTS

// endpoint público — solo proyectos abiertos
router.get("/", async (req, res) => {
  try {
    const parsed = queryProjectsSchema.parse(req.query)

    const { page, limit, minBudget, maxBudget, skillId } = parsed
    const offset = (page - 1) * limit

    const conditions = [
      eq(schema.project.status, "open"), // solo proyectos abiertos
    ]

    if (minBudget) {
      conditions.push(gte(schema.project.budgetMin, String(minBudget)))
    }

    if (maxBudget) {
      conditions.push(lte(schema.project.budgetMax, String(maxBudget)))
    }

    if (skillId) {
      const projectIdsWithSkill = await db
        .select({ projectId: schema.projectSkill.projectId })
        .from(schema.projectSkill)
        .where(eq(schema.projectSkill.skillId, skillId as string))

      if (projectIdsWithSkill.length === 0) {
        res.json({ data: [], page, limit })
        return
      }

      // solo proyectos con la skill seleccionada
      // este me costó entenderlo un poco :') - jose luis
      conditions.push(
        inArray(
          schema.project.id,
          // de todos los proyectos con la skill seleccionada, SE AÑADE A LAS CONDICIONES QUE SOLO MUESTRE LOS PROYECTOS CON LOS ID's que tengan esa skill + las otras condiciones.
          // solo devolvemos los id's de los proyectos.
          projectIdsWithSkill.map((p) => p.projectId),
        ),
      )
    }

    const data = await db.query.project.findMany({
      where: and(...conditions),
      limit,
      offset,
      orderBy: [desc(schema.project.createdAt)],
      with: {
        contractor: {
          with: { user: { columns: { name: true, image: true } } },
        },
        skills: {
          with: { skill: true },
        },
      },
    })

    res.json({ data, page, limit })
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del proyecto." })
      return
    }
    console.error(error)

    res.status(500).json({ error: "Error al obtener los proyectos" })
  }
})

// GET /projects/:id
router.get("/:id", async (req, res) => {
  try {
    const sessionContext = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    })

    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, req.params.id as string),
      with: {
        contractor: {
          with: { user: { columns: { name: true, image: true, id: true } } },
        },
        skills: {
          with: { skill: true },
        },
        proposals: {
          with: {
            freelancer: {
              with: { user: { columns: { name: true, image: true } } },
            },
          },
        },
      },
    })

    if (!project) {
      res.status(404).json({ error: "Project not found" })
      return
    }

    // ocultar propuestas en peticiones publicas, solo mostrar el numero de propuestas

    const isOwner =
      sessionContext?.user?.id &&
      project.contractor.user.id === sessionContext.user.id

    res.json({
      ...project,
      proposals: isOwner ? project.proposals : undefined,
      proposalCount: project.proposals.length,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error al obtener el proyecto" })
  }
})

// POST /projects
router.post("/", requireAuth, async (req: Request, res) => {
  try {
    const parsed = createProjectSchema.parse(req.body)

    // obtener el perfil de contratista asociado al usuario
    const contractor = await db.query.contractorProfile.findFirst({
      where: eq(schema.contractorProfile.userId, req.session!.user.id),
    })

    if (!contractor) {
      res
        .status(403)
        .json({ error: "Debes crear un perfil de contratista primero" })
      return
    }

    const projectId = crypto.randomUUID()

    await db.transaction(async (tx) => {
      // insertar proyecto
      await tx.insert(schema.project).values({
        id: projectId,
        contractorId: contractor.id,
        title: parsed.title,
        description: parsed.description,
        budgetType: parsed.budgetType,
        budgetMin: parsed.budgetMin ? String(parsed.budgetMin) : null,
        budgetMax: parsed.budgetMax ? String(parsed.budgetMax) : null,
        status: "open",
      })

      // insertar skills en la tabla de relacion de skills y proyectos
      // {projectId: "uuid", skillId: "uuid"}
      if (parsed.skills && parsed.skills.length > 0) {
        const skillValues = parsed.skills.map((skillId) => ({
          projectId,
          skillId,
        }))
        await tx.insert(schema.projectSkill).values(skillValues)
      }
    })

    const newProject = await db.query.project.findFirst({
      where: eq(schema.project.id, projectId),
      with: { skills: { with: { skill: true } } },
    })

    res.status(201).json(newProject)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del proyecto" })
      return
    }
    res.status(500).json({ error: "Error al crear el proyecto" })
  }
})

// Actualizar SOLAMENTE el estado del proyecto
// PATCH /projects/:id/status
router.patch("/:id/status", requireAuth, async (req: Request, res) => {
  try {
    const { status } = updateProjectStatusSchema.parse(req.body)

    const project = await db.query.project.findFirst({
      where: eq(schema.project.id, req.params.id as string),
      with: { contractor: true },
    })

    if (!project) {
      res.status(404).json({ error: "Proyecto no encontrado" })
      return
    }

    // Verificar que el usuario sea el dueño del proyecto
    if (project.contractor.userId !== req.session!.user.id) {
      res
        .status(403)
        .json({ error: "No tienes permiso para editar este proyecto" })
      return
    }

    const [updated] = await db
      .update(schema.project)
      .set({ status })
      .where(eq(schema.project.id, req.params.id as string))
      .returning()

    res.json(updated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Error validando los datos del proyecto" })
      return
    }
    res.status(500).json({ error: "Error al actualizar el proyecto" })
  }
})

export default router
