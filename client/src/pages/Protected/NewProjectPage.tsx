import { useState } from "react"
import { useNavigate } from "react-router"
import { z } from "zod"
import { createProject } from "../../lib/projectsApi"
import { useLoading } from "../../context/LoadingContext"
import { showToast } from "../../components/showToast"
import Card from "../../components/Card"
import Input from "../../components/ui/Input"
import TextArea from "../../components/ui/TextArea"
import Radio from "../../components/ui/Radio"
import Button from "../../components/Button"
import { BriefcaseBusiness } from "lucide-react"
import {
  PROJECT_INITIAL_ERRORS,
  type ProjectErrors,
} from "../../types/formErrors"

// validación con zod
const projectSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z
    .string()
    .min(20, "La descripción debe tener al menos 20 caracteres"),
  budgetType: z.enum(["fixed", "hourly"]),
  budgetMin: z.string(),
  budgetMax: z.string(),
})

// estado del formulario
type ProjectForm = {
  title: string
  description: string
  budgetType: "fixed" | "hourly"
  budgetMin: string
  budgetMax: string
}

const DEFAULTS: ProjectForm = {
  title: "",
  description: "",
  budgetType: "fixed",
  budgetMin: "",
  budgetMax: "",
}

export default function NewProjectPage() {
  const navigate = useNavigate()
  const { isLoading, setLoading } = useLoading()
  const [form, setForm] = useState(DEFAULTS)
  const [errors, setErrors] = useState(PROJECT_INITIAL_ERRORS)

  const changeField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof ProjectErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const result = projectSchema.safeParse(form)
    if (!result.success) {
      const cause = z.treeifyError(result.error)
      setErrors({
        ...PROJECT_INITIAL_ERRORS,
        title: cause.properties?.title?.errors[0] ?? "",
        description: cause.properties?.description?.errors[0] ?? "",
      })
      return
    }

    setLoading(true)
    try {
      await createProject({
        title: form.title,
        description: form.description,
        budgetType: form.budgetType,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        skills: [],
      })
      showToast("success", "Proyecto publicado con éxito")
      navigate("/dashboard")
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear el proyecto"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-100">
              <BriefcaseBusiness size={28} className="text-primary" />
              Publicar Proyecto
            </h1>
            <p className="text-zinc-400 mt-1">
              Conecta con los mejores talentos para tu idea
            </p>
          </div>
          <Button onClick={() => navigate(-1)}>Cancelar</Button>
        </div>

        <Card className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="space-y-4">
              <Input
                label="Título del Proyecto"
                value={form.title}
                errorMessage={errors.title}
                onChange={(e) => changeField("title", e.target.value)}
                className="w-full"
                maxLength={100}
              />

              <div className="flex flex-col gap-2">
                <TextArea
                  label="Descripción detallada"
                  value={form.description}
                  errorMessage={errors.description}
                  onChange={(e) => changeField("description", e.target.value)}
                  className="w-full"
                />
              </div>
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
                  checked={form.budgetType === "fixed"}
                  onChange={(e) => changeField("budgetType", e.target.value)}
                />
                <Radio
                  name="budgetType"
                  value="hourly"
                  label="Por hora"
                  checked={form.budgetType === "hourly"}
                  onChange={(e) => changeField("budgetType", e.target.value)}
                />
              </div>

              <div className="flex gap-4">
                <Input
                  label="Mínimo (USD)"
                  value={form.budgetMin}
                  onChange={(e) => changeField("budgetMin", e.target.value)}
                  className="w-full"
                />
                <Input
                  label="Máximo (USD)"
                  value={form.budgetMax}
                  onChange={(e) => changeField("budgetMax", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <Button
              type="submit"
              btnType="secondary"
              disabled={isLoading}
              className="mt-4 py-3">
              {isLoading ? "Publicando..." : "Publicar proyecto"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  )
}
