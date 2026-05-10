import type { Project } from "../../projects/types/projects.types"

export interface Proposal {
  id: string
  projectId: string
  freelancerId: string
  coverLetter: string
  bidAmount: string
  bidType: "fixed" | "hourly"
  status: "pending" | "accepted" | "rejected" | "withdrawn"
  createdAt: string
  updatedAt: string
  freelancer: {
    id: string
    user: { id: string; name: string; image: string | null }
  }
  project?: Project
}

