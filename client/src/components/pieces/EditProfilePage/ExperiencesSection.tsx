import { useState, useEffect } from "react"
import Input from "../../ui/Input"
import DatePicker from "../../ui/DatePicker"
import Button from "../../Button"
import { Plus, Save, X } from "lucide-react"
import {
  createFreelancerExperiences,
  updateFreelancerExperience,
} from "../../../lib/profilesApi"
import type { FreelancerExperience, FreelancerExperienceInput } from "../../../types/profiles"
import { z } from "zod"
import { useLoading } from "../../../context/LoadingContext"
import { EXP_INITIAL_ERRORS } from "../../../types/formErrors"
import Card from "../../Card"
import { showToast } from "../../showToast"
import SingleExperience from "../../SingleExperience"

const experienceFormSchema = z.object({
  title: z.string().min(1, "El cargo es obligatorio."),
  company: z.string().min(1, "La empresa es obligatoria."),
  description: z.string().optional(),
  startDate: z.string().min(1, "La fecha de inicio es obligatoria."),
  endDate: z.string().optional(),
})

type FormValues = {
  title: string
  company: string
  startDate: string
  endDate: string
  description: string
}

const INITIAL_VALUES: FormValues = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
}

interface Props {
  existing: FreelancerExperience[]
  editable?: boolean
}

export default function ExperiencesSection({
  existing,
  editable = true,
}: Props) {
  const [localExisting, setLocalExisting] =
    useState<FreelancerExperience[]>(existing)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState(EXP_INITIAL_ERRORS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { isLoading, setLoading } = useLoading()

  useEffect(() => {
    setLocalExisting(existing)
  }, [existing])

  const handleStartAdd = () => {
    setForm(INITIAL_VALUES)
    setErrors(EXP_INITIAL_ERRORS)
    setEditingId(null)
    setIsAdding(true)
  }

  const handleStartEdit = (exp: FreelancerExperience) => {
    setForm({
      title: exp.title,
      company: exp.company,
      startDate: exp.startDate,
      endDate: exp.endDate || "",
      description: exp.description || "",
    })
    setErrors(EXP_INITIAL_ERRORS)
    setEditingId(exp.id)
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setEditingId(null)
    setForm(INITIAL_VALUES)
    setErrors(EXP_INITIAL_ERRORS)
  }

  const changeField = (field: keyof FormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleLocalDelete = (id: string) => {
    if (editingId === id) {
      handleCancelAdd()
    }
    setLocalExisting((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSave = async () => {
    const validation = experienceFormSchema.safeParse(form)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...EXP_INITIAL_ERRORS,
        title: cause.properties?.title?.errors[0] ?? "",
        company: cause.properties?.company?.errors[0] ?? "",
        startDate: cause.properties?.startDate?.errors[0] ?? "",
        endDate: cause.properties?.endDate?.errors[0] ?? "",
        description: cause.properties?.description?.errors[0] ?? "",
      })
    }

    setLoading(true)
    try {
      const payload: FreelancerExperienceInput = {
        title: form.title,
        company: form.company,
        startDate: form.startDate,
        endDate: form.endDate || null,
        description: form.description || null,
      }

      if (editingId) {
        const result = await updateFreelancerExperience(editingId, payload)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Experiencia actualizada")
        setLocalExisting((prev) =>
          prev.map((item) => (item.id === editingId ? result.data : item)),
        )
      } else {
        const result = await createFreelancerExperiences([payload])
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Experiencia añadida")
        setLocalExisting((prev) => [...prev, ...result.data])
      }

      setIsAdding(false)
      setEditingId(null)
      setForm(INITIAL_VALUES)
      setErrors(EXP_INITIAL_ERRORS)
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-col w-full gap-6">
      <h3 className="text-sm font-semibold text-zinc-200">
        Experiencia laboral
      </h3>

      {/* Items existentes localmente */}
      <div className="flex flex-col gap-4">
        {localExisting.map((exp) => (
          <SingleExperience
            key={exp.id}
            exp={exp}
            editable={editable}
            onEdit={handleStartEdit}
            onDeleted={handleLocalDelete}
          />
        ))}
        {localExisting.length === 0 && !isAdding && (
          <p className="text-sm text-zinc-500 italic">
            No hay experiencias registradas.
          </p>
        )}
      </div>

      {/* Formulario para añadir o editar UNA experiencia */}
      {editable &&
        (isAdding ? (
          <Card className="flex flex-col w-full gap-4 shadow-none">
          <h4 className="text-md font-medium text-zinc-200 border-b border-zinc-700 pb-2">
            {editingId ? "Editar experiencia" : "Añadir experiencia"}
          </h4>
          <div className="flex flex-col">
            <Input
              label="Cargo"
              value={form.title}
              errorMessage={errors.title}
              onChange={(e) => changeField("title", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <Input
              label="Empresa"
              value={form.company}
              errorMessage={errors.company}
              onChange={(e) => changeField("company", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <div className="flex gap-3">
              <DatePicker
                label="Inicio"
                value={form.startDate}
                errorMessage={errors.startDate}
                onChange={(val) => changeField("startDate", val)}
                className="flex-1"
              />
              <DatePicker
                label="Fin (vacío = actual)"
                value={form.endDate || ""}
                errorMessage={errors.endDate}
                onChange={(val) => changeField("endDate", val)}
                className="flex-1"
              />
            </div>

            <Input
              label="Descripción (opcional)"
              value={form.description || ""}
              errorMessage={errors.description}
              onChange={(e) => changeField("description", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              btnType="default"
              onClick={handleCancelAdd}
              disabled={isLoading}
              className="flex items-center gap-2">
              <X size={20} /> Cancelar
            </Button>
            <Button
              type="button"
              btnType="secondary"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2">
              <Save size={20} />{" "}
              {editingId ? "Guardar cambios" : "Guardar experiencia"}
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          type="button"
          btnType="primary"
          onClick={handleStartAdd}
          disabled={isLoading}
          className="w-full py-2.5 text-sm border border-zinc-600 border-dashed bg-transparent hover:bg-zinc-800">
          <Plus size={16} className="inline mr-2" /> Añadir experiencia
        </Button>
      ))}
    </Card>
  )
}
