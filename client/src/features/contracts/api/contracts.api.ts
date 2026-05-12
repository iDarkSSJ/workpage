import { api } from "../../../lib/api"
import {
  type Contract,
  type MyContractsData,
} from "../types/contracts.types"

export function getMyContractsReq() {
  return api.get<MyContractsData>("/contracts")
}

export function completeContractReq(id: string) {
  return api.patch<Contract>(`/contracts/${id}/complete`, {})
}

export function cancelContractReq(id: string) {
  return api.patch<Contract>(`/contracts/${id}/cancel`, {})
}
