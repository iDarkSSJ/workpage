import { useState } from "react"
import { z } from "zod"

import Input from "../../../components/ui/Input"
import Button from "../../../components/Button"
import {
  useCreateContractor,
  useUpdateContractor,
} from "../api/useProfiles.api"
import { updateContractorSchema } from "../schemas/profile.schema"
import type { ContractorProfile } from "../types/profiles.types"
import countries from "../../../data/countries.json"

const INITIAL_ERRORS = { companyName: "", bio: "", country: "", websiteUrl: "" }

export default function ContractorProfileForm({
  isEditMode = false,
  initialData,
}: {
  isEditMode?: boolean
  initialData?: ContractorProfile
}) {
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  const createMut = useCreateContractor()
  const updateMut = useUpdateContractor()

  const isPending = createMut.isPending || updateMut.isPending

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = updateContractorSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      setErrors({
        companyName: cause.properties?.companyName?.errors[0] ?? "",
        bio: cause.properties?.bio?.errors[0] ?? "",
        country: cause.properties?.country?.errors[0] ?? "",
        websiteUrl: cause.properties?.websiteUrl?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)

    if (isEditMode) {
      updateMut.mutate(validation.data)
    } else {
      createMut.mutate(validation.data)
    }
  }

  const handleInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement
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
        Información de contratante
      </h3>
      <Input
        name="companyName"
        defaultValue={initialData?.companyName ?? ""}
        label="Nombre de empresa"
        errorMessage={errors.companyName}
        className="w-full"
      />

      {/* Select de Países */}
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
        name="websiteUrl"
        defaultValue={initialData?.websiteUrl ?? ""}
        label="Sitio web"
        errorMessage={errors.websiteUrl}
        className="w-full"
      />
      <Input
        name="bio"
        defaultValue={initialData?.bio ?? ""}
        label="Bio (descripción breve)"
        errorMessage={errors.bio}
        maxLength={300}
        className="w-full"
      />

      <Button
        type="submit"
        btnType={isEditMode ? "success" : "primary"}
        disabled={isPending}
        className="w-full py-3 text-base font-bold mt-2">
        {isPending
          ? "Guardando..."
          : isEditMode
            ? "Guardar Perfil"
            : "Crear Perfil"}
      </Button>
    </form>
  )
}
