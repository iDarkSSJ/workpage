import { useState } from "react"
import { authClient } from "../../lib/authClient"
import Button from "../Button"
import Input from "../ui/Input"
import Separator from "../ui/Separator"
import GoogleBtn from "./GoogleBtn"
import { userLoginSchema } from "../../validations/userSchema"
import { z } from "zod"
import { showToast } from "../showToast"
import { getErrorMessage } from "../../lib/errorCodes"

const DEFAULTFORMVALUES = {
  email: "",
  password: "",
}

const INITIALERRORS = {
  email: "",
  password: "",
}

export default function LoginForm() {
  const [formValues, setFormValues] = useState(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState(INITIALERRORS)

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = userLoginSchema.safeParse(formValues)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)

      return setErrors({
        ...INITIALERRORS,
        email: cause.properties?.email?.errors[0] ?? "",
        password: cause.properties?.password?.errors[0] ?? "",
      })
    }

    try {
      const { data, error } = await authClient.signIn.email({
        email: formValues.email,
        password: formValues.password,
      })

      if (error) {
        console.log(error) // DEBUG
        showToast("error", getErrorMessage(error.code))
        return
      }

      showToast("success", "Cuenta Creada Correctamente")
      console.log(data) // DEBUG
    } catch (err) {
      console.error(err)
      showToast("error", "Error creando la cuenta, Por favor Intenta de nuevo.")
    }
  }

  const onChangeField =
    (field: keyof typeof DEFAULTFORMVALUES) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Input
          errorMessage={errors.email}
          onChange={onChangeField("email")}
          label="Email"
          type="email"
          className="w-full"
          autoComplete="email"
        />
        <Input
          maxLength={32}
          errorMessage={errors.password}
          onChange={onChangeField("password")}
          label="Contraseña"
          type="password"
          className="w-full"
          autoComplete="new-password"
        />
      </div>

      <Button
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm">
        Iniciar Sesión
      </Button>

      {/* OAuth */}
      <div className="flex flex-col gap-4">
        <Separator label="o continuar con" />
        <GoogleBtn />
      </div>
    </form>
  )
}
