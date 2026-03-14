import { api } from "./api"
import type {
  Project,
  CreateProjectInput,
  UpdateProjectStatusInput,
} from "../types/projects"
import type { PaginatedResponse } from "../types/common"

// GET /api/projects — listar proyectos abiertos con filtros
export function getProjects(params?: {
  page?: number
  limit?: number
  minBudget?: number
  maxBudget?: number
  skillId?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  if (params?.minBudget) query.set("minBudget", String(params.minBudget))
  if (params?.maxBudget) query.set("maxBudget", String(params.maxBudget))
  if (params?.skillId) query.set("skillId", params.skillId)
  const qs = query.toString()
  return api.get<PaginatedResponse<Project>>(`/projects${qs ? `?${qs}` : ""}`)
}

// GET /api/projects/:id — detalle del proyecto
export function getProject(id: string) {
  return api.get<Project>(`/projects/${id}`)
}

// POST /api/projects — crear proyecto (requiere contractor_profile)
export function createProject(data: CreateProjectInput) {
  return api.post<Project>("/projects", data)
}

// PATCH /api/projects/:id/status — cambiar estado del proyecto
export function updateProjectStatus(
  id: string,
  data: UpdateProjectStatusInput,
) {
  return api.patch<Project>(`/projects/${id}/status`, data)
}
