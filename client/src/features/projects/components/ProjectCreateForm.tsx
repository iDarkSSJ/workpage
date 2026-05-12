import { useState } from "react"
import { z } from "zod"
import { useCreateProject } from "../api/useProjects"
import { createProjectSchema } from "../schemas/projects.schema"
import Input from "../../../components/ui/Input"
import TextArea from "../../../components/ui/TextArea"
import Radio from "../../../components/ui/Radio"
import Button from "../../../components/Button"
import FreelancerSkillsInput from "../../profiles/components/FreelancerSkillsInput"
import type { Skill } from "../../profiles/types/profiles.types"
import { AlertCircle } from "lucide-react"

const INITIAL_ERRORS = {
  title: "",
  description: "",
  budgetMin: "",
  budgetMax: "",
  skills: "",
}

export default function ProjectCreateForm() {
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([])

  const createMut = useCreateProject()
  const isPending = createMut.isPending

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const skillsPayload = selectedSkills.map((s) => s.id)

    const validation = createProjectSchema.safeParse({
      ...rawData,
      skills: skillsPayload,
    })

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      setErrors({
        title: cause.properties?.title?.errors[0] ?? "",
        description: cause.properties?.description?.errors[0] ?? "",
        budgetMin: cause.properties?.budgetMin?.errors[0] ?? "",
        budgetMax: cause.properties?.budgetMax?.errors[0] ?? "",
        skills: cause.properties?.skills?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)
    createMut.mutate(validation.data)
  }

  const handleInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    if (target.name && errors[target.name as keyof typeof INITIAL_ERRORS]) {
      setErrors((prev) => ({ ...prev, [target.name]: "" }))
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onInput={handleInput}
      className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
      <div className="space-y-4">
        <Input
          name="title"
          label="Título del Proyecto"
          errorMessage={errors.title}
          className="w-full"
          maxLength={100}
        />

        <TextArea
          name="description"
          max={5000}
          label="Descripción detallada"
          errorMessage={errors.description}
          className="w-full h-40"
        />
      </div>

      <div className="space-y-2 -mt-4">
        <FreelancerSkillsInput
          selected={selectedSkills}
          onChange={(skills) => {
            setSelectedSkills(skills)
            if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }))
          }}
        />
        {errors.skills && (
          <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
            <AlertCircle size={16} /> {errors.skills}
          </p>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-700/50 space-y-4">
        <label className="text-sm font-semibold text-zinc-300 block">
          Tipo de Presupuesto
        </label>
        <div className="flex flex-col gap-4">
          <Radio
            name="budgetType"
            value="fixed"
            label="Precio Fijo"
            defaultChecked
          />
          <Radio name="budgetType" value="hourly" label="Por hora" />
        </div>

        <div>
          <div>
            <Input
              name="budgetMin"
              label="Mínimo (USD)"
              type="number"
              className="w-full"
              placeholder="0"
            />
            {errors.budgetMin && (
              <p className="text-sm font-semibold text-red-500 -mt-3">
                {errors.budgetMin}
              </p>
            )}
          </div>
          <div>
            <Input
              name="budgetMax"
              label="Máximo (USD)"
              type="number"
              className="w-full"
              placeholder="0"
            />
            {errors.budgetMax && (
              <p className="text-sm font-semibold text-red-500 -mt-3">
                {errors.budgetMax}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        btnType="primary"
        disabled={isPending}
        className="mt-4 py-3 text-base font-bold">
        {isPending ? "Publicando..." : "Publicar Proyecto"}
      </Button>
    </form>
  )
}
