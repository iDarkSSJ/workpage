import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../../components/showToast"
import {
  createFreelancerCertificationsReq,
  updateFreelancerCertificationReq,
  deleteFreelancerCertificationReq,
} from "./profiles.api"
import type { CertificationData } from "../schemas/profile.schema"

export const useCreateCertifications = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CertificationData[]) =>
      createFreelancerCertificationsReq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Certificaciones guardadas")
    },
    onError: (error) => showToast("error", error.message || "Error al guardar"),
  })
}

export const useUpdateCertification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CertificationData }) =>
      updateFreelancerCertificationReq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Certificación actualizada")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al actualizar"),
  })
}

export const useDeleteCertification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteFreelancerCertificationReq(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Certificación eliminada")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al eliminar"),
  })
}
