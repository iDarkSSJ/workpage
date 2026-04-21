import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getMyContractsReq,
  completeContractReq,
  cancelContractReq,
} from "./contracts.api"
import { showToast } from "../../../components/showToast"

export function useMyContracts() {
  return useQuery({
    queryKey: ["my-contracts"],
    queryFn: getMyContractsReq,
  })
}

export function useCompleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => completeContractReq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-contracts"] })
      showToast("success", "Contrato completado con éxito")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "Error al completar contrato"),
  })
}

export function useCancelContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cancelContractReq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-contracts"] })
      showToast("success", "Contrato cancelado")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "Error al cancelar el contrato"),
  })
}
