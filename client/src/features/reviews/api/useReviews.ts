import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createReviewReq,
  deleteReviewReq,
  updateReviewReq,
} from "./reviews.api"
import type { CreateReviewData } from "../schemas/reviews.schema"
import { showToast } from "../../../components/showToast"

export const useCreateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      contractId,
      data,
    }: {
      contractId: string
      data: CreateReviewData
    }) => createReviewReq(contractId, data),
    onSuccess: () => {
      // Invalidar cache de contratos y perfiles para ver los cambios
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
      queryClient.invalidateQueries({ queryKey: ["freelancer-profile"] })
      queryClient.invalidateQueries({ queryKey: ["contractor-profile"] })
      showToast("success", "Valoración enviada correctamente")
    },
    onError: (error: Error) => {
      showToast("error", error.message || "Error al enviar la valoración")
    },
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteReviewReq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
      queryClient.invalidateQueries({ queryKey: ["freelancer-profile"] })
      queryClient.invalidateQueries({ queryKey: ["contractor-profile"] })
      showToast("success", "Valoración eliminada")
    },
    onError: (error: Error) => {
      showToast("error", error.message || "Error al eliminar la valoración")
    },
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateReviewData }) =>
      updateReviewReq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] })
      queryClient.invalidateQueries({ queryKey: ["freelancer-profile"] })
      queryClient.invalidateQueries({ queryKey: ["contractor-profile"] })
      showToast("success", "Valoración actualizada")
    },
    onError: (error: Error) => {
      showToast("error", error.message || "Error al actualizar la valoración")
    },
  })
}
