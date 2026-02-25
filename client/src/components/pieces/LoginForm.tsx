import { useState } from "react"
import Button from "../Button"
import Input from "../ui/Input"
import Separator from "../ui/Separator"
import GoogleBtn from "./GoogleBtn"
import { userLoginSchema } from "../../validations/userSchema"
import { z } from "zod"
import { showToast } from "../showToast"
import { signInReq } from "../../lib/authRequest"
import { useLoading } from "../../context/LoadingContext"
import Link from "../Link"

type FormValuesT = z.infer<typeof userLoginSchema>
type FormErrorsT = Record<keyof FormValuesT, string>

const DEFAULTFORMVALUES: z.infer<typeof userLoginSchema> = {
  email: "",
  password: "",
}

const INITIALERRORS: Record<keyof typeof DEFAULTFORMVALUES, string> = {
  email: "",
  password: "",
}

export default function LoginForm() {
  const [formValues, setFormValues] = useState<FormValuesT>(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState<FormErrorsT>(INITIALERRORS)
  const { isLoading, setLoading } = useLoading()

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validation = userLoginSchema.safeParse(formValues)

      if (!validation.success) {
        const cause = z.treeifyError(validation.error)

        return setErrors({
          ...INITIALERRORS,
          email: cause.properties?.email?.errors[0] ?? "",
          password: cause.properties?.password?.errors[0] ?? "",
        })
      }

      const { success, error } = await signInReq(formValues)

      if (!success) {
        showToast("error", error ?? "Ocurrió un error inesperado.")
        return
      }

      showToast("success", "Sesión iniciada correctamente.")
    } finally {
      setLoading(false)
    }
  }

  const onChangeField =
    (field: keyof typeof DEFAULTFORMVALUES) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col">
      <div className="flex flex-col">
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
          maxLength={32}
          errorMessage={errors.password}
          onChange={onChangeField("password")}
          label="Contraseña"
          type="password"
          className="w-full"
          autoComplete="new-password"
        />
      </div>

      <div className="gap-2 flex flex-col">
        <Link path="/forgot-password" className="ml-auto">
          ¿Olvidaste la contraseña?
        </Link>

        <Button
          disabled={isLoading}
          aria-disabled={isLoading}
          type="submit"
          btnType="secondary"
          className="w-full py-2.5 text-sm">
          Iniciar Sesión
        </Button>

        {/* OAuth */}
        <div className="flex flex-col gap-4">
          <Separator label="o continuar con" />
          <GoogleBtn disabled={isLoading} aria-disabled={isLoading} />
        </div>
      </div>
    </form>
  )
}
