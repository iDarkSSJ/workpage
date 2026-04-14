import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../../components/showToast"

import {
  createFreelancerPortfolioReq,
  updateFreelancerPortfolioItemReq,
  deleteFreelancerPortfolioItemReq,
} from "./profiles.api"
import type { PortfolioData } from "../schemas/profile.schema"

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFreelancerPortfolioReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Proyecto añadido al portafolio")
    },
    onError: (error) => showToast("error", error.message || "Error al guardar"),
  })
}

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PortfolioData }) =>
      updateFreelancerPortfolioItemReq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Proyecto actualizado")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al actualizar"),
  })
}

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFreelancerPortfolioItemReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Proyecto eliminado")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al eliminar"),
  })
}
