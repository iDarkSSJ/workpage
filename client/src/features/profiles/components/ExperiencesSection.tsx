import { useState } from "react"
import { z } from "zod"
import { Plus, Save, X } from "lucide-react"

import Input from "../../../components/ui/Input"
import DatePicker from "../../../components/ui/DatePicker"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import SingleExperience from "./SingleExperience"

import {
  useCreateExperiences,
  useUpdateExperience,
} from "../api/useExperiences.api"
import type { Experience } from "../types/profiles.types"
import { experienceSchema } from "../schemas/profile.schema"

const INITIAL_ERRORS = {
  title: "",
  company: "",
  startDate: "",
  endDate: "",
  description: "",
}

interface Props {
  existing: Experience[]
  editable?: boolean
}

export default function ExperiencesSection({
  existing,
  editable = true,
}: Props) {
  const [localExisting, setLocalExisting] = useState<Experience[]>(existing)
  const [isAdding, setIsAdding] = useState(false)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [editingId, setEditingId] = useState<string | null>(null)

  const createMut = useCreateExperiences()
  const updateMut = useUpdateExperience()

  const isPending = createMut.isPending || updateMut.isPending

  const handleStartAdd = () => {
    setErrors(INITIAL_ERRORS)
    setEditingId(null)
    setIsAdding(true)
  }

  const handleStartEdit = (exp: Experience) => {
    setErrors(INITIAL_ERRORS)
    setEditingId(exp.id)
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setEditingId(null)
    setErrors(INITIAL_ERRORS)
  }

  const handleLocalDelete = (id: string) => {
    if (editingId === id) {
      handleCancelAdd()
    }
    setLocalExisting((prev) => prev.filter((item) => item.id !== id))
  }

  const currentEdit = editingId
    ? localExisting.find((e) => e.id === editingId)
    : null

  const defaultValues = currentEdit
    ? {
        title: currentEdit.title,
        company: currentEdit.company,
        startDate: currentEdit.startDate,
        endDate: currentEdit.endDate || null,
        description: currentEdit.description || "",
      }
    : { title: "", company: "", startDate: "", endDate: null, description: "" }

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = experienceSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...INITIAL_ERRORS,
        title: cause.properties?.title?.errors[0] ?? "",
        company: cause.properties?.company?.errors[0] ?? "",
        startDate: cause.properties?.startDate?.errors[0] ?? "",
        endDate: cause.properties?.endDate?.errors[0] ?? "",
        description: cause.properties?.description?.errors[0] ?? "",
      })
    }

    setErrors(INITIAL_ERRORS)
    const payload = validation.data

    if (editingId) {
      updateMut.mutate(
        { id: editingId, data: payload },
        {
          onSuccess: (result) => {
            setLocalExisting((prev) =>
              prev.map((item) => (item.id === editingId ? result : item)),
            )
            handleCancelAdd()
          },
        },
      )
    } else {
      createMut.mutate([payload], {
        onSuccess: (result) => {
          setLocalExisting((prev) => [...prev, ...result])
          handleCancelAdd()
        },
      })
    }
  }

  const handleInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    if (target.name && errors[target.name as keyof typeof INITIAL_ERRORS]) {
      setErrors((prev) => ({ ...prev, [target.name]: "" }))
    }
  }

  return (
    <Card className="flex flex-col w-full gap-6">
      <h3 className="text-sm font-semibold text-zinc-200">
        Experiencia laboral
      </h3>

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

      {editable &&
        (isAdding ? (
          <form
            key={editingId || "new"}
            onSubmit={onSubmit}
            onInput={handleInput}
            className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
            <h4 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              {editingId ? "Editar experiencia" : "Añadir experiencia"}
            </h4>
            <Input
              name="title"
              defaultValue={defaultValues.title}
              label="Cargo"
              errorMessage={errors.title}
              className="w-full"
              disabled={isPending}
            />
            <Input
              name="company"
              defaultValue={defaultValues.company}
              label="Empresa"
              errorMessage={errors.company}
              className="w-full"
              disabled={isPending}
            />
            <div className="flex gap-3 flex-wrap">
              <DatePicker
                name="startDate"
                defaultValue={defaultValues.startDate}
                label="Inicio"
                errorMessage={errors.startDate}
                className="w-full sm:flex-1"
              />
              <DatePicker
                name="endDate"
                defaultValue={defaultValues.endDate}
                label="Fin (vacío = actual)"
                errorMessage={errors.endDate}
                className="w-full sm:flex-1"
              />
            </div>
            <Input
              name="description"
              defaultValue={defaultValues.description}
              label="Descripción (opcional)"
              errorMessage={errors.description}
              className="w-full"
              disabled={isPending}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-zinc-900 flex-wrap">
              <Button
                type="button"
                btnType="default"
                onClick={handleCancelAdd}
                disabled={isPending}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 font-bold">
                <X size={18} /> Cancelar
              </Button>
              <Button
                type="submit"
                btnType={editingId ? "success" : "primary"}
                disabled={isPending}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 font-bold">
                <Save size={18} />{" "}
                {editingId ? "Guardar Cambios" : "Guardar Experiencia"}
              </Button>
            </div>
          </form>
        ) : (
          <Button
            type="button"
            btnType="primary"
            onClick={handleStartAdd}
            disabled={isPending}
            className="w-full py-2.5 text-sm border border-zinc-600 border-dashed bg-transparent hover:bg-zinc-800">
            <Plus size={16} className="inline mr-2" /> Añadir experiencia
          </Button>
        ))}
    </Card>
  )
}
