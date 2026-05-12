import { useState } from "react"
import { z } from "zod"
import { Plus, Save, X } from "lucide-react"

import Input from "../../../components/ui/Input"
import DatePicker from "../../../components/ui/DatePicker"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import SingleCertification from "./SingleCertification"

import {
  useCreateCertifications,
  useUpdateCertification,
} from "../api/useCertifications.api"
import type { Certification as FreelancerCertification } from "../types/profiles.types"
import { certificationSchema } from "../schemas/profile.schema"

const INITIAL_ERRORS = {
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
  const [localExisting, setLocalExisting] = useState(existing)
  const [isAdding, setIsAdding] = useState(false)
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  const [editingId, setEditingId] = useState<string | null>(null)

  const createMut = useCreateCertifications()
  const updateMut = useUpdateCertification()

  const isPending = createMut.isPending || updateMut.isPending

  const handleStartAdd = () => {
    setErrors(INITIAL_ERRORS)
    setEditingId(null)
    setIsAdding(true)
  }

  const handleStartEdit = (cert: FreelancerCertification) => {
    setErrors(INITIAL_ERRORS)
    setEditingId(cert.id)
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
    ? localExisting.find((c) => c.id === editingId)
    : null

  const defaultValues = currentEdit
    ? {
        name: currentEdit.name,
        institution: currentEdit.institution,
        issuedDate: currentEdit.issuedDate || "",
        url: currentEdit.url || "",
      }
    : { name: "", institution: "", issuedDate: "", url: "" }

  const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = certificationSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...INITIAL_ERRORS,
        name: cause.properties?.name?.errors[0] ?? "",
        institution: cause.properties?.institution?.errors[0] ?? "",
        issuedDate: cause.properties?.issuedDate?.errors[0] ?? "",
        url: cause.properties?.url?.errors[0] ?? "",
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
      <h3 className="text-sm font-semibold text-zinc-200">Certificaciones</h3>

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

      {editable &&
        (isAdding ? (
          <form
            key={editingId || "new"}
            onSubmit={onSubmit}
            onInput={handleInput}
            className="bg-zinc-950/50 p-6 rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
            <h4 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              {editingId ? "Editar certificación" : "Añadir certificación"}
            </h4>
            <Input
              name="name"
              defaultValue={defaultValues.name}
              label="Nombre de certificación"
              errorMessage={errors.name}
              className="w-full"
              disabled={isPending}
            />
            <Input
              name="institution"
              defaultValue={defaultValues.institution}
              label="Institución"
              errorMessage={errors.institution}
              className="w-full"
              disabled={isPending}
            />
            <DatePicker
              name="issuedDate"
              defaultValue={defaultValues.issuedDate}
              label="Fecha de emisión"
              errorMessage={errors.issuedDate}
              className="w-full"
            />
            <Input
              name="url"
              defaultValue={defaultValues.url}
              label="URL de verificación (opcional)"
              errorMessage={errors.url}
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
                {editingId ? "Guardar Cambios" : "Guardar Certificación"}
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
            <Plus size={16} className="inline mr-2" /> Añadir certificación
          </Button>
        ))}
    </Card>
  )
}
