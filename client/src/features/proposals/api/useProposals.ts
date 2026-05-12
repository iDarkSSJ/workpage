import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createProposalReq,
  getProjectProposalsReq,
  updateProposalStatusReq,
  getMyProposalsReq,
  updateProposalReq,
} from "./proposals.api"
import type {
  CreateProposalData as CreateProposalInput,
  UpdateProposalStatusData as UpdateProposalStatusInput,
} from "../schemas/proposals.schema"
import { showToast } from "../../../components/showToast"

export const useProjectProposals = (projectId: string) => {
  return useQuery({
    queryKey: ["proposals", projectId],
    queryFn: () => getProjectProposalsReq(projectId),
    enabled: Boolean(projectId),
    refetchOnWindowFocus: false,
  })
}

export const useMyProposals = () => {
  return useQuery({
    queryKey: ["my-proposals"],
    queryFn: getMyProposalsReq,
    refetchOnWindowFocus: false,
  })
}

export const useCreateProposal = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProposalInput) => createProposalReq(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] })
      queryClient.invalidateQueries({ queryKey: ["proposals", projectId] })
      showToast("success", "Propuesta enviada con éxito")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "No se pudo enviar la propuesta"),
  })
}

export const useUpdateProposalStatus = (projectId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateProposalStatusInput
    }) => updateProposalStatusReq(id, data),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] })
        queryClient.invalidateQueries({ queryKey: ["proposals", projectId] })
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      showToast("success", "Estado de la propuesta actualizado")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "Error al actualizar la propuesta"),
  })
}

export const useUpdateProposal = (projectId?: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateProposalInput }) =>
      updateProposalReq(id, data),
    onSuccess: () => {
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["project", projectId] })
        queryClient.invalidateQueries({ queryKey: ["proposals", projectId] })
      }
      queryClient.invalidateQueries({ queryKey: ["my-proposals"] })
      showToast("success", "Propuesta actualizada con éxito")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "Error al actualizar la propuesta"),
  })
}
