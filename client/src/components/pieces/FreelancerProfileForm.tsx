import Input from "../ui/Input"
import Button from "../Button"
import { useLoading } from "../../context/LoadingContext"
import {
  type FreelancerFormErrors,
  FL_INITIAL_ERRORS,
} from "../../types/formErrors"

export type FreelancerBaseForm = {
  bio: string
  category: string
  hourlyRate: string
  country: string
  linkedinUrl: string
  githubUrl: string
  websiteUrl: string
  skills: string[]
}

interface Props {
  form: FreelancerBaseForm
  onChange: (field: keyof FreelancerBaseForm, value: string) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  isEditMode?: boolean
  errors?: FreelancerFormErrors
}

export default function FreelancerProfileForm({
  form,
  onChange,
  onSubmit,
  isEditMode = false,
  errors = FL_INITIAL_ERRORS,
}: Props) {
  const { isLoading } = useLoading()

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-zinc-200">
        Información general
      </h3>

      <Input
        label="Categoría"
        value={form.category}
        errorMessage={errors.category}
        onChange={(e) => onChange("category", e.target.value)}
        className="w-full"
      />

      <Input
        label="Tarifa por hora (USD)"
        value={form.hourlyRate}
        errorMessage={errors.hourlyRate}
        onChange={(e) => onChange("hourlyRate", e.target.value)}
        className="w-full"
      />

      <Input
        label="País"
        value={form.country}
        errorMessage={errors.country}
        onChange={(e) => onChange("country", e.target.value)}
        className="w-full"
      />

      <Input
        label="LinkedIn"
        value={form.linkedinUrl}
        errorMessage={errors.linkedinUrl}
        onChange={(e) => onChange("linkedinUrl", e.target.value)}
        className="w-full"
      />

      <Input
        label="GitHub"
        value={form.githubUrl}
        errorMessage={errors.githubUrl}
        onChange={(e) => onChange("githubUrl", e.target.value)}
        className="w-full"
      />

      <Input
        label="Sitio web"
        value={form.websiteUrl}
        errorMessage={errors.websiteUrl}
        onChange={(e) => onChange("websiteUrl", e.target.value)}
        className="w-full"
      />

      <Input
        label="Bio"
        value={form.bio}
        errorMessage={errors.bio}
        maxLength={300}
        onChange={(e) => onChange("bio", e.target.value)}
        className="w-full"
      />

      <Button
        type="submit"
        btnType="secondary"
        disabled={isLoading}
        className="w-full py-2.5 text-sm">
        {isLoading
          ? "Guardando..."
          : isEditMode
            ? "Guardar perfil"
            : "Crear perfil"}
      </Button>
    </form>
  )
}
