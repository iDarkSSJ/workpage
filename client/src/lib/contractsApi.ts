import { api } from "./api"
import type { Contract, MyContracts } from "../types/projects"

// GET /api/contracts — mis contratos (como freelancer y como contratante)
export function getMyContracts() {
  return api.get<MyContracts>("/contracts")
}

// PATCH /api/contracts/:id/complete — completar contrato (solo el contratante)
export function completeContract(id: string) {
  return api.patch<Contract>(`/contracts/${id}/complete`, {})
}
