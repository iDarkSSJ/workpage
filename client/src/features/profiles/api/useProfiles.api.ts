import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { showToast } from "../../../components/showToast"
import { createContractorReq, createFreelancerReq, getContractorProfileReq, getFreelancerProfileReq, getMyProfileReq, updateContractorReq, updateFreelancerReq } from "./profiles.api"

export const useFreelancerProfile = (id?: string) => {
  return useQuery({
    queryKey: ["freelancer-profile", id],
    queryFn: () => getFreelancerProfileReq(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export const useContractorProfile = (id?: string) => {
  return useQuery({
    queryKey: ["contractor-profile", id],
    queryFn: () => getContractorProfileReq(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
  })
}

export const useMyProfile = () => {
  return useQuery({
    queryKey: ["my-profiles"],
    queryFn: getMyProfileReq,
    refetchOnWindowFocus: false,
    // 5 minutos de cache
    staleTime: 1000 * 60 * 5,
  })
}

export const useCreateFreelancer = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFreelancerReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Perfil de Freelancer creado")
      navigate("/dashboard")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al crear perfil"),
  })
}

export const useCreateContractor = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createContractorReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Perfil de Contratante creado")
      navigate("/dashboard")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al crear perfil"),
  })
}

export const useUpdateFreelancer = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateFreelancerReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Perfil Freelancer actualizado")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al actualizar"),
  })
}

export const useUpdateContractor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateContractorReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profiles"] })
      showToast("success", "Perfil Contratante actualizado")
    },
    onError: (error) =>
      showToast("error", error.message || "Error al actualizar"),
  })
}
