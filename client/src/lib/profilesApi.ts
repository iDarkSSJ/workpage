import { api } from "./api"
import type {
  FreelancerProfile,
  ContractorProfile,
  FreelancerProfileInput,
  ContractorProfileInput,
  MyProfiles,
} from "../types/profiles"
import type { PaginatedResponse } from "../types/common"

// --- FREELANCERS ---

// GET /api/profiles/freelancers/:id — perfil público completo
export function getFreelancerProfile(id: string) {
  return api.get<FreelancerProfile>(`/profiles/freelancers/${id}`)
}

// GET /api/profiles/freelancers — explorar freelancers (Etapa 2: endpoint aún no existe en servidor)
export function getFreelancers(params?: {
  page?: number
  limit?: number
  skillId?: string
  category?: string
  country?: string
}) {
  const query = new URLSearchParams()
  if (params?.page) query.set("page", String(params.page))
  if (params?.limit) query.set("limit", String(params.limit))
  if (params?.skillId) query.set("skillId", params.skillId)
  if (params?.category) query.set("category", params.category)
  if (params?.country) query.set("country", params.country)
  const qs = query.toString()
  return api.get<PaginatedResponse<FreelancerProfile>>(
    `/profiles/freelancers${qs ? `?${qs}` : ""}`,
  )
}

// POST /api/profiles/freelancers/me — crear perfil freelancer
export function createFreelancerProfile(data: FreelancerProfileInput) {
  return api.post<FreelancerProfile>("/profiles/freelancers/me", data)
}

// PUT /api/profiles/freelancers/me — actualizar perfil freelancer
export function updateFreelancerProfile(data: Partial<FreelancerProfileInput>) {
  return api.put<FreelancerProfile>("/profiles/freelancers/me", data)
}

// --- CONTRACTORS ---

// GET /api/profiles/contractors/:id — perfil público
export function getContractorProfile(id: string) {
  return api.get<ContractorProfile>(`/profiles/contractors/${id}`)
}

// POST /api/profiles/contractors/me — crear perfil contratante
export function createContractorProfile(data: ContractorProfileInput) {
  return api.post<ContractorProfile>("/profiles/contractors/me", data)
}

// PUT /api/profiles/contractors/me — actualizar perfil contratante
export function updateContractorProfile(
  data: Partial<ContractorProfileInput>,
) {
  return api.put<ContractorProfile>("/profiles/contractors/me", data)
}

// --- ME (Etapa 2: endpoint aún no existe en servidor) ---

// GET /api/profiles/me — ambos perfiles del usuario logueado
export function getMyProfiles() {
  return api.get<MyProfiles>("/profiles/me")
}
