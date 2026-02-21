import { useState } from "react"
import Button from "../Button"
import Input from "../ui/Input"
import { z } from "zod"
import { showToast } from "../showToast"
import { forgotPasswordReq } from "../../lib/authRequest"

const DEFAULTFORMVALUES = {
  email: "",
}

const INITIALERRORS = {
  email: "",
}

export default function ForgotPasswordForm() {
  const [formValues, setFormValues] = useState(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState(INITIALERRORS)

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = z.email().safeParse(formValues.email)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)

      return setErrors({
        ...INITIALERRORS,
        email: cause.errors[0] ?? "",
      })
    }

    const { success, error } = await forgotPasswordReq(formValues)

    if (!success) {
      showToast("error", error ?? "Ocurrió un error inesperado.")
      return
    }

    showToast(
      "success",
      "Si el correo existe, recibirás un enlace para restablecer la contraseña.",
    )

    setFormValues(DEFAULTFORMVALUES)
  }

  const onChangeField =
    (field: keyof typeof DEFAULTFORMVALUES) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-2">
      <Input
        errorMessage={errors.email}
        onChange={onChangeField("email")}
        label="Email"
        type="email"
        className="w-full"
        autoComplete="email"
      />

      <Button
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm">
        Enviar enlace
      </Button>
    </form>
  )
}
