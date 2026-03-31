import { api } from "./api"
import type {
  FreelancerProfile,
  ContractorProfile,
  FreelancerProfileInput,
  ContractorProfileInput,
  MyProfiles,
  FreelancerExperience,
  FreelancerCertification,
  FeaturedProject,
  FreelancerExperienceInput,
  FreelancerCertificationInput,
  FreelancerProjectInput,
} from "../types/profiles"

// --- FREELANCERS ---

// GET /api/profiles/freelancers/:id — perfil público completo
export function getFreelancerProfile(id: string) {
  return api.get<FreelancerProfile>(`/profiles/freelancers/${id}`)
}

// POST /api/profiles/freelancers/me — crear perfil freelancer
export function createFreelancerProfile(data: FreelancerProfileInput) {
  return api.post<FreelancerProfile>("/profiles/freelancers/me", data)
}

// PUT /api/profiles/freelancers/me — actualizar perfil freelancer
export function updateFreelancerProfile(data: FreelancerProfileInput) {
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
export function updateContractorProfile(data: ContractorProfileInput) {
  return api.put<ContractorProfile>("/profiles/contractors/me", data)
}

// --- FREELANCER SECTIONS ---

// POST /api/profiles/freelancers/me/experiences — crear experiencias (array)
export function createFreelancerExperiences(data: FreelancerExperienceInput[]) {
  return api.post<FreelancerExperience[]>("/profiles/freelancers/me/experiences", data)
}

// DELETE /api/profiles/freelancers/me/experiences/:id — eliminar una experiencia
export function deleteFreelancerExperience(id: string) {
  return api.delete(`/profiles/freelancers/me/experiences/${id}`)
}

// PATCH /api/profiles/freelancers/me/experiences/:id — editar una experiencia
export function updateFreelancerExperience(id: string, data: Partial<FreelancerExperienceInput>) {
  return api.patch<FreelancerExperience>(`/profiles/freelancers/me/experiences/${id}`, data)
}

// POST /api/profiles/freelancers/me/certifications — crear certificaciones (array)
export function createFreelancerCertifications(data: FreelancerCertificationInput[]) {
  return api.post<FreelancerCertification[]>("/profiles/freelancers/me/certifications", data)
}

// DELETE /api/profiles/freelancers/me/certifications/:id — eliminar una certificación
export function deleteFreelancerCertification(id: string) {
  return api.delete(`/profiles/freelancers/me/certifications/${id}`)
}

// PATCH /api/profiles/freelancers/me/certifications/:id — editar una certificación
export function updateFreelancerCertification(id: string, data: Partial<FreelancerCertificationInput>) {
  return api.patch<FreelancerCertification>(`/profiles/freelancers/me/certifications/${id}`, data)
}

// POST /api/profiles/freelancers/me/portfolio — crear proyectos (array)
export function createFreelancerPortfolio(data: FreelancerProjectInput[]) {
  return api.post<FeaturedProject[]>("/profiles/freelancers/me/portfolio", data)
}

// DELETE /api/profiles/freelancers/me/portfolio/:id — eliminar un proyecto
export function deleteFreelancerPortfolioItem(id: string) {
  return api.delete(`/profiles/freelancers/me/portfolio/${id}`)
}

// PATCH /api/profiles/freelancers/me/portfolio/:id — editar un proyecto
export function updateFreelancerPortfolioItem(id: string, data: Partial<FreelancerProjectInput>) {
  return api.patch<FeaturedProject>(`/profiles/freelancers/me/portfolio/${id}`, data)
}

// GET /api/profiles/me — ambos perfiles del usuario logueado
export function getMyProfiles() {
  return api.get<MyProfiles>("/profiles/me")
}
