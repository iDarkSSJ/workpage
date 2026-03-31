import type { Review } from "./reviews"

// Skill — catálogo de habilidades
export interface Skill {
  id: string
  name: string
  category: string
}

// Sub-entidades del freelancer
export interface FreelancerExperience {
  id: string
  freelancerId: string
  title: string
  company: string
  description: string | null
  startDate: string
  endDate: string | null // null = empleo actual
}

export interface FreelancerCertification {
  id: string
  freelancerId: string
  name: string
  institution: string
  issuedDate: string | null
  url: string | null
}

export interface FeaturedProject {
  id: string
  freelancerId: string
  title: string
  description: string | null
  imageUrl: string | null
  projectUrl: string | null
  createdAt: string
}

// Intermediario de skills del freelancer (dentro de la respuesta del perfil)
export interface FreelancerSkillEntry {
  freelancerId: string
  skillId: string
  skill: Skill
}

// Perfil público del freelancer
export interface FreelancerProfile {
  id: string
  userId: string
  bio: string | null
  category: string | null
  hourlyRate: string | null // numeric viene como string desde Drizzle/pg
  country: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  createdAt: string
  updatedAt: string
  // relaciones incluidas en GET /profiles/freelancers/:id
  user?: { name: string; image: string | null; email: string }
  skills?: FreelancerSkillEntry[]
  experiences?: FreelancerExperience[]
  certifications?: FreelancerCertification[]
  featuredProjects?: FeaturedProject[]
  reviews?: Review[]
}

// Perfil público del contratante
export interface ContractorProfile {
  id: string
  userId: string
  companyName: string | null
  bio: string | null
  country: string | null
  websiteUrl: string | null
  createdAt: string
  updatedAt: string
  // relaciones incluidas en GET /profiles/contractors/:id
  user?: { name: string; image: string | null; email: string }
  reviews?: Review[]
}

// Respuesta de GET /api/profiles/me
export interface MyProfiles {
  freelancerProfile: FreelancerProfile | null
  contractorProfile: ContractorProfile | null
}

// Inputs para crear/actualizar perfiles
export type FreelancerProfileInput = {
  bio?: string
  category?: string
  hourlyRate?: string | number
  country?: string
  linkedinUrl?: string
  githubUrl?: string
  websiteUrl?: string
  skills?: string[] 
}

export type ContractorProfileInput = {
  companyName?: string
  bio?: string
  country?: string
  websiteUrl?: string
}

export type FreelancerExperienceInput = Omit<FreelancerExperience, "id" | "freelancerId">
export type FreelancerCertificationInput = Omit<FreelancerCertification, "id" | "freelancerId">
export type FreelancerProjectInput = Omit<FeaturedProject, "id" | "freelancerId" | "createdAt">
