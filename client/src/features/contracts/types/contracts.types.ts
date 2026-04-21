import { type Project } from "../../projects/types/projects.types"
import { type Review } from "../../reviews/types/reviews.types"

export type ContractStatus = "active" | "completed" | "cancelled"

export interface ContractParty {
  id: string
  userId: string
  user: {
    id: string
    name: string
    image: string | null
  }
}

export interface Contract {
  id: string
  proposalId: string
  projectId: string
  contractorId: string
  freelancerId: string
  agreedAmount: string
  status: ContractStatus
  startedAt: string
  completedAt: string | null
  project: Project
  freelancer: ContractParty
  contractor: ContractParty
  reviews: Review[]
}

export interface MyContractsData {
  asFreelancer: Contract[]
  asContractor: Contract[]
}
