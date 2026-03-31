import { useState, useEffect } from "react"
import Input from "../../ui/Input"
import Button from "../../Button"
import { Plus, Save, X } from "lucide-react"
import {
  createFreelancerPortfolio,
  updateFreelancerPortfolioItem,
} from "../../../lib/profilesApi"
import type { FeaturedProject, FreelancerProjectInput } from "../../../types/profiles"
import { z } from "zod"
import { useLoading } from "../../../context/LoadingContext"
import { PORT_INITIAL_ERRORS } from "../../../types/formErrors"
import Card from "../../Card"
import { showToast } from "../../showToast"
import SinglePortfolio from "../../SinglePortfolio"

const portfolioFormSchema = z.object({
  title: z.string().min(1, "El título del proyecto es obligatorio."),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  projectUrl: z
    .url("La URL no es válida.")
    .optional()
    .or(z.literal(""))
    .nullable(),
})

type FormValues = {
  title: string
  description: string
  projectUrl: string
  imageUrl: string
}

const INITIAL_VALUES: FormValues = {
  title: "",
  description: "",
  projectUrl: "",
  imageUrl: "",
}

interface Props {
  existing: FeaturedProject[]
  editable?: boolean
}

export default function PortfolioSection({ existing, editable = true }: Props) {
  const [localExisting, setLocalExisting] =
    useState<FeaturedProject[]>(existing)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState(PORT_INITIAL_ERRORS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { isLoading, setLoading } = useLoading()

  useEffect(() => {
    setLocalExisting(existing)
  }, [existing])

  const handleStartAdd = () => {
    setForm(INITIAL_VALUES)
    setErrors(PORT_INITIAL_ERRORS)
    setEditingId(null)
    setIsAdding(true)
  }

  const handleStartEdit = (project: FeaturedProject) => {
    setForm({
      title: project.title,
      description: project.description || "",
      projectUrl: project.projectUrl || "",
      imageUrl: project.imageUrl || "",
    })
    setErrors(PORT_INITIAL_ERRORS)
    setEditingId(project.id)
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setEditingId(null)
    setForm(INITIAL_VALUES)
    setErrors(PORT_INITIAL_ERRORS)
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
    const validation = portfolioFormSchema.safeParse(form)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...PORT_INITIAL_ERRORS,
        title: cause.properties?.title?.errors[0] ?? "",
        description: cause.properties?.description?.errors[0] ?? "",
        projectUrl: cause.properties?.projectUrl?.errors[0] ?? "",
        imageUrl: cause.properties?.imageUrl?.errors[0] ?? "",
      })
    }

    setLoading(true)
    try {
      const payload: FreelancerProjectInput = {
        title: form.title,
        description: form.description || null,
        imageUrl: form.imageUrl || null,
        projectUrl: form.projectUrl || null,
      }

      if (editingId) {
        const result = await updateFreelancerPortfolioItem(editingId, payload)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Proyecto actualizado")
        setLocalExisting((prev) =>
          prev.map((item) => (item.id === editingId ? result.data : item)),
        )
      } else {
        const result = await createFreelancerPortfolio([payload])
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Proyecto añadido")
        setLocalExisting((prev) => [...prev, ...result.data])
      }

      setIsAdding(false)
      setEditingId(null)
      setForm(INITIAL_VALUES)
      setErrors(PORT_INITIAL_ERRORS)
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
      <h3 className="text-sm font-semibold text-zinc-200">Portafolio</h3>

      {/* Items existentes localmente */}
      <div className="flex flex-col gap-4">
        {localExisting.map((project) => (
          <SinglePortfolio
            key={project.id}
            project={project}
            editable={editable}
            onEdit={handleStartEdit}
            onDeleted={handleLocalDelete}
          />
        ))}
        {localExisting.length === 0 && !isAdding && (
          <p className="text-sm text-zinc-500 italic">
            No hay proyectos registrados.
          </p>
        )}
      </div>

      {/* Añadir o editar proyecto */}
      {editable &&
        (isAdding ? (
          <Card className="flex flex-col w-full gap-4 shadow-none">
          <h4 className="text-md font-medium text-zinc-200 border-b border-zinc-700 pb-2">
            {editingId ? "Editar proyecto" : "Añadir proyecto"}
          </h4>
          <div className="flex flex-col">
            <Input
              label="Título del proyecto"
              value={form.title}
              errorMessage={errors.title}
              onChange={(e) => changeField("title", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <Input
              label="Descripción (opcional)"
              value={form.description || ""}
              errorMessage={errors.description}
              onChange={(e) => changeField("description", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <Input
              label="URL del proyecto (opcional)"
              value={form.projectUrl || ""}
              errorMessage={errors.projectUrl}
              onChange={(e) => changeField("projectUrl", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <Input
              label="URL de imagen (opcional)"
              value={form.imageUrl || ""}
              errorMessage={errors.imageUrl}
              onChange={(e) => changeField("imageUrl", e.target.value)}
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
              {editingId ? "Guardar cambios" : "Guardar proyecto"}
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
          <Plus size={16} className="inline mr-2" /> Añadir proyecto
        </Button>
      ))}
    </Card>
  )
}
