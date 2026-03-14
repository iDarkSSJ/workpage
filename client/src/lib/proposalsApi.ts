import { api } from "./api"
import type {
  Proposal,
  CreateProposalInput,
  UpdateProposalStatusInput,
} from "../types/projects"

// POST /api/proposals/project/:projectId — crear propuesta (freelancer)
export function createProposal(projectId: string, data: CreateProposalInput) {
  return api.post<Proposal>(`/proposals/project/${projectId}`, data)
}

// GET /api/proposals/project/:projectId — ver propuestas (solo el contratante dueño)
export function getProjectProposals(projectId: string) {
  return api.get<Proposal[]>(`/proposals/project/${projectId}`)
}

// PATCH /api/proposals/:id/status — aceptar/rechazar (contratante) o retirar (freelancer)
export function updateProposalStatus(
  id: string,
  data: UpdateProposalStatusInput,
) {
  return api.patch<Proposal | { message: string }>(
    `/proposals/${id}/status`,
    data,
  )
}
