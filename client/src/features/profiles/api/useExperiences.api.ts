import { useMutation, useQueryClient } from "@tanstack/react-query"
import { showToast } from "../../../components/showToast"

import {
  createFreelancerExperiencesReq,
  updateFreelancerExperienceReq,
  deleteFreelancerExperienceReq,
} from "./profiles.api"
import type { ExperienceData } from "../schemas/profile.schema"

export const useCreateExperiences = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFreelancerExperiencesReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Experiencia guardada")
    },
    onError: (error) => showToast("error", error.message || "Error al guardar"),
  })
}

export const useUpdateExperience = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExperienceData }) =>
      updateFreelancerExperienceReq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Experiencia actualizada")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al actualizar"),
  })
}

export const useDeleteExperience = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteFreelancerExperienceReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Experiencia eliminada")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al eliminar"),
  })
}
