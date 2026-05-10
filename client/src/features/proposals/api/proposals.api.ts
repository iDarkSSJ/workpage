import { api } from "../../../lib/api"
import type {
  Proposal,
} from "../types/proposals.types"
import type {
  CreateProposalData as CreateProposalInput,
  UpdateProposalStatusData as UpdateProposalStatusInput,
} from "../schemas/proposals.schema"

export function createProposalReq(
  projectId: string,
  data: CreateProposalInput,
) {
  return api.post<Proposal>(`/proposals/project/${projectId}`, data)
}

export function getProjectProposalsReq(projectId: string) {
  return api.get<Proposal[]>(`/proposals/project/${projectId}`)
}

export function updateProposalStatusReq(
  id: string,
  data: UpdateProposalStatusInput,
) {
  return api.patch<Proposal>(`/proposals/${id}/status`, data)
}

export function updateProposalReq(id: string, data: CreateProposalInput) {
  return api.put<Proposal>(`/proposals/${id}`, data)
}

export function getMyProposalsReq() {
  return api.get<Proposal[]>("/proposals/me")
}
