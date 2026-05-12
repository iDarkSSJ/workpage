import { api } from "../../../lib/api"
import type {
  CertificationData,
  ExperienceData,
  PortfolioData,
  UpdateContractorData,
  UpdateFreelancerData,
} from "../schemas/profile.schema"
import type {
  FreelancerProfile,
  ContractorProfile,
  Experience,
  Certification,
  PortfolioItem,
  MyProfiles,
} from "../types/profiles.types"

// --- MY PROFILES ---

export function getMyProfileReq() {
  return api.get<MyProfiles>("/profiles/me")
}

// --- CREAR Y ACTUALIZAR PERFILES ---

export function createFreelancerReq(data: UpdateFreelancerData) {
  return api.post<FreelancerProfile>("/profiles/freelancers/me", data)
}

export function updateFreelancerReq(data: UpdateFreelancerData) {
  return api.put<FreelancerProfile>("/profiles/freelancers/me", data)
}

export function createContractorReq(data: UpdateContractorData) {
  return api.post<ContractorProfile>("/profiles/contractors/me", data)
}

export function updateContractorReq(data: UpdateContractorData) {
  return api.put<ContractorProfile>("/profiles/contractors/me", data)
}

// --- PERFILES PÚBLICOS ---

export function getFreelancerProfileReq(id: string) {
  return api.get<FreelancerProfile>(`/profiles/freelancers/${id}`)
}

export function getContractorProfileReq(id: string) {
  return api.get<ContractorProfile>(`/profiles/contractors/${id}`)
}

// --- EXPERIENCES ---

export function createFreelancerExperiencesReq(data: ExperienceData[]) {
  return api.post<Experience[]>("/profiles/freelancers/me/experiences", data)
}

export function deleteFreelancerExperienceReq(id: string) {
  return api.delete(`/profiles/freelancers/me/experiences/${id}`)
}

export function updateFreelancerExperienceReq(id: string, data: ExperienceData) {
  return api.put<Experience>(`/profiles/freelancers/me/experiences/${id}`, data)
}

// --- CERTIFICATIONS ---

export function createFreelancerCertificationsReq(data: CertificationData[]) {
  return api.post<Certification[]>("/profiles/freelancers/me/certifications", data)
}

export function deleteFreelancerCertificationReq(id: string) {
  return api.delete(`/profiles/freelancers/me/certifications/${id}`)
}

export function updateFreelancerCertificationReq(id: string, data: CertificationData) {
  return api.put<Certification>(`/profiles/freelancers/me/certifications/${id}`, data)
}

// --- PORTFOLIO ---

export function createFreelancerPortfolioReq(data: PortfolioData[]) {
  return api.post<PortfolioItem[]>("/profiles/freelancers/me/portfolio", data)
}

export function deleteFreelancerPortfolioItemReq(id: string) {
  return api.delete(`/profiles/freelancers/me/portfolio/${id}`)
}

export function updateFreelancerPortfolioItemReq(id: string, data: PortfolioData) {
  return api.put<PortfolioItem>(`/profiles/freelancers/me/portfolio/${id}`, data)
}