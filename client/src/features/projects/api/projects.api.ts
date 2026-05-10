import { api } from "../../../lib/api"
import type {
  Project,
} from "../types/projects.types"
import type {
  CreateProjectData as CreateProjectInput,
  UpdateProjectStatusData as UpdateProjectStatusInput,
} from "../schemas/projects.schema"
import type { PaginatedResponse } from "../../../lib/types"

export function getProjectsReq(params?: {
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

export function getMyProjectsReq() {
  return api.get<Project[]>("/profiles/contractors/projects")
}

export function getProjectReq(id: string) {
  return api.get<Project>(`/projects/${id}`)
}

export function createProjectReq(data: CreateProjectInput) {
  return api.post<Project>("/projects", data)
}

export function updateProjectStatusReq(
  id: string,
  data: UpdateProjectStatusInput,
) {
  return api.patch<Project>(`/projects/${id}/status`, data)
}
