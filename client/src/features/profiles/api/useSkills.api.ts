import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../../lib/api"
import type { Skill } from "../types/profiles.types"

// --- REQUESTS ---

export function getSkillsReq(q?: string) {
  const url = q ? `/profiles/skills?q=${encodeURIComponent(q)}` : "/profiles/skills"
  return api.get<Skill[]>(url)
}

export function createSkillReq(name: string) {
  return api.post<Skill>("/profiles/skills", { name })
}

// --- HOOKS ---

export function useSkillsSearch(query: string = "") {
  return useQuery({
    queryKey: ["skills", query],
    queryFn: () => getSkillsReq(query),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

export function useCreateSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSkillReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] })
    },
  })
}
