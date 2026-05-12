import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getProjectsReq,
  getProjectReq,
  createProjectReq,
  getMyProjectsReq,
  updateProjectStatusReq,
} from "./projects.api"
import type { CreateProjectData as CreateProjectInput } from "../schemas/projects.schema"
import { showToast } from "../../../components/showToast"
import { useNavigate } from "react-router"

export const useProjects = (params?: {
  page?: number
  limit?: number
  minBudget?: number
  maxBudget?: number
  skillId?: string
}) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjectsReq(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 2,
  })
}

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: () => getProjectReq(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  })
}

export const useMyProjects = () => {
  return useQuery({
    queryKey: ["my-projects"],
    queryFn: getMyProjectsReq,
    refetchOnWindowFocus: false,
  })
}

export const useCreateProject = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProjectInput) => createProjectReq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] })
      showToast("success", "Proyecto publicado con éxito")
      navigate("/dashboard")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "No se pudo crear el proyecto"),
  })
}

export const useCloseProject = (projectId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => updateProjectStatusReq(projectId, { status: "closed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] })
      showToast("success", "Proyecto cerrado correctamente")
    },
    onError: (error: Error) =>
      showToast("error", error.message || "No se pudo cerrar el proyecto"),
  })
}
