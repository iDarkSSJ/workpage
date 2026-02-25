import { useState } from "react"
import Button from "../Button"
import Input from "../ui/Input"
import { z } from "zod"
import { showToast } from "../showToast"
import { forgotPasswordReq } from "../../lib/authRequest"
import { useLoading } from "../../context/LoadingContext"

const DEFAULTFORMVALUES = {
  email: "",
}

const INITIALERRORS = {
  email: "",
}

export default function ForgotPasswordForm() {
  const [formValues, setFormValues] = useState(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState(INITIALERRORS)
  const { isLoading, setLoading } = useLoading()

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
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
    } finally {
      setLoading(false)
    }
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
        value={formValues.email}
        errorMessage={errors.email}
        onChange={onChangeField("email")}
        label="Email"
        type="email"
        className="w-full"
        autoComplete="email"
      />

      <Button
        disabled={isLoading}
        aria-disabled={isLoading}
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm">
        Enviar enlace
      </Button>
    </form>
  )
}
