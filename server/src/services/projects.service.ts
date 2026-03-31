import { db } from "../database/database"
import * as schema from "../database/schema"
import { eq, and, gte, lte, inArray, desc } from "drizzle-orm"
import crypto from "crypto"
import { AppError } from "../utils/AppError"
import { QueryProjectsData, CreateProjectData } from "../schemas/projects.schema"
import { count } from "drizzle-orm"

export const getProjects = async (filters: QueryProjectsData) => {
  const { page, minBudget, maxBudget, skillId } = filters

  // paginacion
  const LIMIT = 10
  const offset = (page - 1) * LIMIT

  // filtros
  const conditions = [eq(schema.project.status, "open")]

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
      .where(eq(schema.projectSkill.skillId, skillId))

    if (projectIdsWithSkill.length === 0) {
      return { data: [], page, limit: LIMIT }
    }

    // convierto los objetos en un array de ids
    const validProjectIds = projectIdsWithSkill.map((p) => p.projectId)

    // y filtro por los proyectos con esas IDs
    conditions.push(inArray(schema.project.id, validProjectIds))
  }

  const data = await db.query.project.findMany({
    where: and(...conditions),
    limit: LIMIT,
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

  return { data, page, limit: LIMIT }
}


export const getProjectById = async (id: string, requesterUserId?: string) => {
  const project = await db.query.project.findFirst({
    where: eq(schema.project.id, id),
    with: {
      contractor: {
        with: { user: { columns: { name: true, image: true, id: true } } },
      },
      skills: {
        with: { skill: true },
      },
    },
  })

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404)
  }

  const isOwner = Boolean(
    requesterUserId && project.contractor.user.id === requesterUserId
  )

  let proposals = undefined
  let proposalCount = 0

  if (isOwner) {
    proposals = await db.query.proposal.findMany({
      where: eq(schema.proposal.projectId, id),
      with: {
        freelancer: {
          with: { user: { columns: { name: true, image: true, id: true } } },
        },
      },
    })
    proposalCount = proposals.length
  } else {
    const [result] = await db
      .select({ value: count() })
      .from(schema.proposal)
      .where(eq(schema.proposal.projectId, id))

    proposalCount = result.value
  }

  return {
    ...project,
    proposals,
    proposalCount,
  }
}

export const createProject = async (userId: string, data: CreateProjectData) => {
  const contractor = await db.query.contractorProfile.findFirst({
    where: eq(schema.contractorProfile.userId, userId),
  })

  if (!contractor) {
    throw new AppError("Debes crear un perfil de contratista primero", 403)
  }

  const projectId = crypto.randomUUID()
  const { skills, ...projectData } = data

  await db.transaction(async (tx) => {
    await tx.insert(schema.project).values({
      id: projectId,
      contractorId: contractor.id,
      status: "open",
      ...projectData,
    })

    const skillValues = skills.map((skillId) => ({
      projectId,
      skillId,
    }))
    await tx.insert(schema.projectSkill).values(skillValues)
  })

  const newProject = await db.query.project.findFirst({
    where: eq(schema.project.id, projectId),
    with: { skills: { with: { skill: true } } },
  })

  return newProject
}

export const updateProjectStatus = async (userId: string, projectId: string, status: string) => {
  const project = await db.query.project.findFirst({
    where: eq(schema.project.id, projectId),
    with: { contractor: true },
  })

  if (!project) {
    throw new AppError("Proyecto no encontrado", 404)
  }

  if (project.contractor.userId !== userId) {
    throw new AppError("No tienes permiso para editar este proyecto", 403)
  }

  const [updated] = await db
    .update(schema.project)
    .set({ status })
    .where(eq(schema.project.id, projectId))
    .returning()

  return updated
}