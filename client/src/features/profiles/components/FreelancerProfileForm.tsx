import { useState } from "react"
import { z } from "zod"

import Input from "../../../components/ui/Input"
import Button from "../../../components/Button"
import {
  useCreateFreelancer,
  useUpdateFreelancer,
} from "../api/useProfiles.api"
import { updateFreelancerSchema } from "../schemas/profile.schema"
import type { FreelancerProfile, Skill } from "../types/profiles.types"
import FreelancerSkillsInput from "./FreelancerSkillsInput"
import countries from "../../../data/countries.json"
import { formatAmount } from "../../../utils/currency"

const INITIAL_ERRORS = {
  category: "",
  hourlyRate: "",
  country: "",
  bio: "",
  linkedinUrl: "",
  githubUrl: "",
  websiteUrl: "",
}

export default function FreelancerProfileForm({
  isEditMode = false,
  initialData,
}: {
  isEditMode?: boolean
  initialData?: FreelancerProfile
}) {
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(
    initialData?.skills?.map((s) => s.skill) || [],
  )
  const [hasChanges, setHasChanges] = useState(false)

  const createMut = useCreateFreelancer()
  const updateMut = useUpdateFreelancer()

  const isPending = createMut.isPending || updateMut.isPending

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = updateFreelancerSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      setErrors({
        category: cause.properties?.category?.errors[0] ?? "",
        hourlyRate: cause.properties?.hourlyRate?.errors[0] ?? "",
        country: cause.properties?.country?.errors[0] ?? "",
        bio: cause.properties?.bio?.errors[0] ?? "",
        linkedinUrl: cause.properties?.linkedinUrl?.errors[0] ?? "",
        githubUrl: cause.properties?.githubUrl?.errors[0] ?? "",
        websiteUrl: cause.properties?.websiteUrl?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)

    const skillsPayload = selectedSkills.map((s) => s.id)
    const payload = { ...validation.data, skills: skillsPayload }

    if (isEditMode) {
      updateMut.mutate(payload)
    } else {
      createMut.mutate(payload)
    }
    setHasChanges(false)
  }

  const handleInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
    setHasChanges(true)
    if (target.name && errors[target.name as keyof typeof INITIAL_ERRORS]) {
      setErrors((prev) => ({ ...prev, [target.name]: "" }))
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={handleInput}
      className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
      <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
        Información freelancer
      </h3>
      <Input
        name="category"
        defaultValue={initialData?.category ?? ""}
        label="Categoría"
        errorMessage={errors.category}
        className="w-full"
      />
      <Input
        name="hourlyRate"
        defaultValue={formatAmount(initialData?.hourlyRate)}
        label="Tarifa por hora (USD)"
        errorMessage={errors.hourlyRate}
        className="w-full"
      />

      <div className="flex flex-col font-semibold w-full gap-2 mb-4">
        <label className="text-zinc-400 ml-1">País</label>
        <select
          name="country"
          defaultValue={initialData?.country ?? ""}
          className="w-full rounded-xl border border-zinc-500 bg-zinc-900 px-4 h-12 text-zinc-100 outline-none hover:border-primary focus:ring focus:ring-primary/50 transition-colors cursor-pointer">
          <option value="" disabled>
            Selecciona un país
          </option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.country && (
          <span className="text-danger text-sm">{errors.country}</span>
        )}
      </div>

      <Input
        name="linkedinUrl"
        defaultValue={initialData?.linkedinUrl ?? ""}
        label="LinkedIn"
        errorMessage={errors.linkedinUrl}
        className="w-full"
      />
      <Input
        name="githubUrl"
        defaultValue={initialData?.githubUrl ?? ""}
        label="GitHub"
        errorMessage={errors.githubUrl}
        className="w-full"
      />
      <Input
        name="websiteUrl"
        defaultValue={initialData?.websiteUrl ?? ""}
        label="Sitio web"
        errorMessage={errors.websiteUrl}
        className="w-full"
      />
      <Input
        name="bio"
        defaultValue={initialData?.bio ?? ""}
        label="Bio"
        errorMessage={errors.bio}
        maxLength={300}
        className="w-full"
      />

      <FreelancerSkillsInput
        selected={selectedSkills}
        onChange={(newSkills) => {
          setSelectedSkills(newSkills)
          setHasChanges(true)
        }}
      />

      <Button
        type="submit"
        btnType={isEditMode ? "success" : "primary"}
        disabled={!hasChanges || isPending}
        className="w-full py-3 text-base font-bold">
        {isPending
          ? "Guardando..."
          : isEditMode
            ? "Guardar Perfil"
            : "Crear Perfil"}
      </Button>
    </form>
  )
}
