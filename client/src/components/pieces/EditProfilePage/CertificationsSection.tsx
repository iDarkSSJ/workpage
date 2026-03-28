import { useState, useEffect } from "react"
import Input from "../../ui/Input"
import DatePicker from "../../ui/DatePicker"
import Button from "../../Button"
import { Plus, Save, X } from "lucide-react"
import {
  createFreelancerCertifications,
  updateFreelancerCertification,
} from "../../../lib/profilesApi"
import type { FreelancerCertification, FreelancerCertificationInput } from "../../../types/profiles"
import { z } from "zod"
import { useLoading } from "../../../context/LoadingContext"
import { CERT_INITIAL_ERRORS } from "../../../types/formErrors"
import Card from "../../Card"
import { showToast } from "../../showToast"
import SingleCertification from "../../SingleCertification"

const certificationFormSchema = z.object({
  name: z.string().min(1, "El nombre de la certificación es obligatorio."),
  institution: z.string().min(1, "La institución es obligatoria."),
  issuedDate: z.string().optional(),
  url: z.url("La URL no es válida.").optional().or(z.literal("")).nullable(),
})

type FormValues = {
  name: string
  institution: string
  issuedDate: string
  url: string
}

const INITIAL_VALUES: FormValues = {
  name: "",
  institution: "",
  issuedDate: "",
  url: "",
}

interface Props {
  existing: FreelancerCertification[]
  editable?: boolean
}

export default function CertificationsSection({
  existing,
  editable = true,
}: Props) {
  const [localExisting, setLocalExisting] =
    useState<FreelancerCertification[]>(existing)
  const [isAdding, setIsAdding] = useState(false)
  const [form, setForm] = useState(INITIAL_VALUES)
  const [errors, setErrors] = useState(CERT_INITIAL_ERRORS)
  const [editingId, setEditingId] = useState<string | null>(null)
  const { isLoading, setLoading } = useLoading()

  useEffect(() => {
    setLocalExisting(existing)
  }, [existing])

  const handleStartAdd = () => {
    setForm(INITIAL_VALUES)
    setErrors(CERT_INITIAL_ERRORS)
    setEditingId(null)
    setIsAdding(true)
  }

  const handleStartEdit = (cert: FreelancerCertification) => {
    setForm({
      name: cert.name,
      institution: cert.institution,
      issuedDate: cert.issuedDate || "",
      url: cert.url || "",
    })
    setErrors(CERT_INITIAL_ERRORS)
    setEditingId(cert.id)
    setIsAdding(true)
  }

  const handleCancelAdd = () => {
    setIsAdding(false)
    setEditingId(null)
    setForm(INITIAL_VALUES)
    setErrors(CERT_INITIAL_ERRORS)
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
    const validation = certificationFormSchema.safeParse(form)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...CERT_INITIAL_ERRORS,
        name: cause.properties?.name?.errors[0] ?? "",
        institution: cause.properties?.institution?.errors[0] ?? "",
        issuedDate: cause.properties?.issuedDate?.errors[0] ?? "",
        url: cause.properties?.url?.errors[0] ?? "",
      })
    }

    setLoading(true)
    try {
      const payload: FreelancerCertificationInput = {
        name: form.name,
        institution: form.institution,
        issuedDate: form.issuedDate || null,
        url: form.url || null,
      }

      if (editingId) {
        const result = await updateFreelancerCertification(editingId, payload)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Certificación actualizada")
        setLocalExisting((prev) =>
          prev.map((item) => (item.id === editingId ? result.data : item)),
        )
      } else {
        const result = await createFreelancerCertifications([payload])
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        showToast("success", "Certificación añadida")
        setLocalExisting((prev) => [...prev, ...result.data])
      }

      setIsAdding(false)
      setEditingId(null)
      setForm(INITIAL_VALUES)
      setErrors(CERT_INITIAL_ERRORS)
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
      <h3 className="text-sm font-semibold text-zinc-200">Certificaciones</h3>

      {/* Items existentes */}
      <div className="flex flex-col gap-4">
        {localExisting.map((cert) => (
          <SingleCertification
            key={cert.id}
            cert={cert}
            editable={editable}
            onEdit={handleStartEdit}
            onDeleted={handleLocalDelete}
          />
        ))}
        {localExisting.length === 0 && !isAdding && (
          <p className="text-sm text-zinc-500 italic">
            No hay certificaciones registradas.
          </p>
        )}
      </div>

      {/* Añadir o editar certificación */}
      {editable &&
        (isAdding ? (
          <Card className="flex flex-col w-full gap-4 shadow-none">
          <h4 className="text-md font-medium text-zinc-200 border-b border-zinc-700 pb-2">
            {editingId ? "Editar certificación" : "Añadir certificación"}
          </h4>
          <div className="flex flex-col">
            <Input
              label="Nombre de certificación"
              value={form.name}
              errorMessage={errors.name}
              onChange={(e) => changeField("name", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <Input
              label="Institución"
              value={form.institution}
              errorMessage={errors.institution}
              onChange={(e) => changeField("institution", e.target.value)}
              className="w-full"
              disabled={isLoading}
            />

            <DatePicker
              label="Fecha de emisión"
              value={form.issuedDate || ""}
              errorMessage={errors.issuedDate}
              onChange={(val) => changeField("issuedDate", val)}
              className="w-full"
            />

            <Input
              label="URL de verificación (opcional)"
              value={form.url || ""}
              errorMessage={errors.url}
              onChange={(e) => changeField("url", e.target.value)}
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
              {editingId ? "Guardar cambios" : "Guardar certificación"}
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
          <Plus size={16} className="inline mr-2" /> Añadir certificación
        </Button>
      ))}
    </Card>
  )
}
