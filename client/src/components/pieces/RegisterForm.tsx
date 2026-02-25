import { useState } from "react"
import Input from "../ui/Input"
import Radio from "../ui/Radio"
import Button from "../Button"
import Separator from "../ui/Separator"
import GoogleBtn from "./GoogleBtn"
import type { SetURLSearchParams } from "react-router"
import { userSignUpSchema } from "../../validations/userSchema"
import z from "zod"
import { showToast } from "../showToast"
import { signUpReq } from "../../lib/authRequest"
import { useLoading } from "../../context/LoadingContext"

interface RegisterFormProps {
  role: roleType
  setSearchParams: SetURLSearchParams
}

type FormValuesT = z.infer<typeof userSignUpSchema>
type FormErrorsT = Record<keyof FormValuesT, string>
type roleType = "contractor" | "freelance"

const DEFAULTFORMVALUES: z.infer<typeof userSignUpSchema> = {
  role: "" as roleType,
  name: "",
  email: "",
  password: "",
}

const INITIALERRORS: Record<keyof typeof DEFAULTFORMVALUES, string> = {
  role: "",
  name: "",
  email: "",
  password: "",
}

export default function RegisterForm({
  role,
  setSearchParams,
}: RegisterFormProps) {
  const [formValues, setFormValues] = useState<FormValuesT>({
    ...DEFAULTFORMVALUES,
    role,
  })
  const [errors, setErrors] = useState<FormErrorsT>(INITIALERRORS)
  const { isLoading, setLoading } = useLoading()

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validation = userSignUpSchema.safeParse(formValues)

      if (!validation.success) {
        const cause = z.treeifyError(validation.error)

        return setErrors({
          ...INITIALERRORS,
          name: cause.properties?.name?.errors[0] ?? "",
          role: cause.properties?.role?.errors[0] ?? "",
          email: cause.properties?.email?.errors[0] ?? "",
          password: cause.properties?.password?.errors[0] ?? "",
        })
      }

      const { success, error } = await signUpReq(formValues)

      if (!success) {
        showToast("error", error ?? "Ocurrió un error inesperado.")
        return
      }

      showToast("success", "Cuenta creada correctamente.")
    } finally {
      setLoading(false)
    }
  }

  const onChangeField =
    (field: keyof typeof DEFAULTFORMVALUES) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
      if (field === "role") setSearchParams({ role: e.target.value })
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Input
          value={formValues.name}
          errorMessage={errors.name}
          onChange={onChangeField("name")}
          label="Nombre Completo"
          className="w-full"
          autoComplete="name"
        />
        <Input
          value={formValues.email}
          errorMessage={errors.email}
          onChange={onChangeField("email")}
          label="Email"
          type="email"
          className="w-full"
          autoComplete="email"
        />
        <Input
          value={formValues.password}
          errorMessage={errors.password}
          onChange={onChangeField("password")}
          maxLength={32}
          label="Contraseña"
          type="password"
          className="w-full"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-secondary-bg border border-primary-bg">
        <span className="text-base font-semibold text-zinc-200">
          Tipo de Cuenta
        </span>

        <div className="flex flex-col gap-2">
          <Radio
            checked={formValues.role === "contractor"}
            onChange={onChangeField("role")}
            name="roleType"
            value="contractor"
            label="Contratante"
          />
          <Radio
            checked={formValues.role === "freelance"}
            onChange={onChangeField("role")}
            name="roleType"
            value="freelance"
            label="Freelance"
          />
        </div>
        {errors.role && (
          <span className="text-danger text-sm min-h-5 block">
            {errors.role}
          </span>
        )}
      </div>

      <Button
        disabled={isLoading}
        aria-disabled={isLoading}
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm">
        Crear Cuenta
      </Button>

      {/* OAuth */}
      <div className="flex flex-col gap-4">
        <Separator label="o continuar con" />
        <GoogleBtn />
      </div>
    </form>
  )
}
