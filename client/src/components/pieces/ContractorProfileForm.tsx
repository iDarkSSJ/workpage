import Input from "../ui/Input"
import Button from "../Button"
import { useLoading } from "../../context/LoadingContext"
import { type ContractorFormErrors, CT_INITIAL_ERRORS } from "../../types/formErrors"

// tipo del formulario
export type ContractorFormT = {
  companyName: string
  bio: string
  country: string
  websiteUrl: string
}



// props del componente controlado
interface Props {
  form: ContractorFormT
  onChangeField: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void
  isEditMode?: boolean
  errors?: ContractorFormErrors
}

export default function ContractorProfileForm({
  form,
  onChangeField,
  onSubmit,
  isEditMode = false,
  errors = CT_INITIAL_ERRORS,
}: Props) {
  const { isLoading } = useLoading()

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <Input
        label="Nombre de empresa (opcional)"
        value={form.companyName}
        errorMessage={errors.companyName}
        onChange={onChangeField("companyName")}
        className="w-full"
      />
      <Input
        label="País"
        value={form.country}
        errorMessage={errors.country}
        onChange={onChangeField("country")}
        className="w-full"
      />
      <Input
        label="Sitio web"
        value={form.websiteUrl}
        errorMessage={errors.websiteUrl}
        onChange={onChangeField("websiteUrl")}
        className="w-full"
      />
      <Input
        label="Bio (descripción breve)"
        value={form.bio}
        errorMessage={errors.bio}
        onChange={onChangeField("bio")}
        maxLength={300}
        className="w-full"
      />
      <Button
        type="submit"
        btnType="secondary"
        disabled={isLoading}
        className="w-full py-2.5 text-sm mt-2">
        {isLoading
          ? isEditMode
            ? "Guardando..."
            : "Creando perfil..."
          : isEditMode
            ? "Guardar cambios"
            : "Crear perfil"}
      </Button>
    </form>
  )
}
