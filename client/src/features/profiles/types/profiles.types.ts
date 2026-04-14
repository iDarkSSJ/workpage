import type { Review } from "../../reviews/types/reviews.types"

export interface Skill {
  id: string
  name: string
  category: string
}

export interface FreelancerSkillEntry {
  freelancerId: string
  skillId: string
  skill: Skill
}

export interface Experience {
  id: string
  title: string
  company: string
  description: string | null
  startDate: string 
  endDate: string | null
}

export interface Certification {
  id: string
  name: string
  institution: string
  issuedDate: string
  url: string | null
}

export interface PortfolioItem {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  projectUrl: string | null
  createdAt: string
}

// Perfil público del freelancer
export interface FreelancerProfile {
  id: string
  userId: string
  bio: string | null
  category: string | null
  hourlyRate: string | null
  country: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  websiteUrl: string | null
  createdAt: string
  updatedAt: string
  user: { name: string; image: string | null; email: string }
  skills?: FreelancerSkillEntry[]
  experiences?: Experience[]
  certifications?: Certification[]
  portfolioItems?: PortfolioItem[]
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
  user: { name: string; image: string | null; email: string }
  reviews?: Review[]
}

export interface MyProfiles {
  freelancerProfile: FreelancerProfile | null
  contractorProfile: ContractorProfile | null
}

