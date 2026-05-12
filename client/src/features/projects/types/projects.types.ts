import type { Proposal } from "../../proposals/types/proposals.types"
import type { Skill } from "../../profiles/types/profiles.types"

export interface ProjectSkillEntry {
  projectId: string
  skillId: string
  skill: Skill
}

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
  contractor: {
    id: string
    country?: string | null
    bio?: string | null
    user: { id: string; name: string; image: string | null }
  }
  skills?: ProjectSkillEntry[]
  proposals?: Proposal[]
  proposalCount?: number
}

