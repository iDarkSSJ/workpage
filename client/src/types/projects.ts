import type { Skill } from "./profiles"

export interface ProjectSkillEntry {
  projectId: string
  skillId: string
  skill: Skill
}

// Proyecto publicado por un contratante
export interface Project {
  id: string
  contractorId: string
  title: string
  description: string
  budgetType: "fixed" | "hourly"
  budgetMin: string | null
  budgetMax: string | null
  status: "open" | "in_progress" | "closed" | "completed"
  createdAt: string
  updatedAt: string
  // relaciones opcionales según el endpoint
  contractor?: {
    id: string
    country?: string | null
    bio?: string | null
    user: { id: string; name: string; image: string | null }
  }
  skills?: ProjectSkillEntry[]
  proposals?: Proposal[]
  proposalCount?: number
}

// Propuesta de un freelancer a un proyecto
export interface Proposal {
  id: string
  projectId: string
  freelancerId: string
  coverLetter: string
  bidAmount: string // numeric viene como string
  bidType: "fixed" | "hourly"
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  createdAt: string
  updatedAt: string
  freelancer?: {
    id: string
    user: { id: string; name: string; image: string | null }
  }
}

// Contrato generado al aceptarse una propuesta
export interface Contract {
  id: string
  proposalId: string
  projectId: string
  contractorId: string
  freelancerId: string
  agreedAmount: string // numeric viene como string
  status: "active" | "completed" | "cancelled"
  startedAt: string
  completedAt: string | null
  // relaciones incluidas en GET /api/contracts
  project?: Project
  freelancer?: {
    id: string
    user: { id: string; name: string; image: string | null }
  }
  contractor?: {
    id: string
    country?: string | null
    bio?: string | null
    user: { id: string; name: string; image: string | null }
  }
}

// Respuesta de GET /api/contracts
export interface MyContracts {
  asFreelancer: Contract[]
  asContractor: Contract[]
}

// Inputs
export type CreateProjectInput = {
  title: string
  description: string
  budgetType: "fixed" | "hourly"
  budgetMin?: number
  budgetMax?: number
  skills?: string[] 
}

export type CreateProposalInput = {
  coverLetter: string
  bidAmount: number
  bidType: "fixed" | "hourly"
}

export type UpdateProposalStatusInput = {
  status: "accepted" | "rejected" | "withdrawn"
}

export type UpdateProjectStatusInput = {
  status: "open" | "in_progress" | "closed" | "completed"
}
