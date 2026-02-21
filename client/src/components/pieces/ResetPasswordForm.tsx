import { useState } from "react"
import Button from "../Button"
import Input from "../ui/Input"
import { z } from "zod"
import { showToast } from "../showToast"
import { resetPasswordReq } from "../../lib/authRequest"
import { resetPasswordSchema } from "../../validations/userSchema"

type FormValuesT = z.infer<typeof resetPasswordSchema>

const DEFAULTFORMVALUES: FormValuesT = {
  password: "",
  confirmPassword: "",
}

const INITIALERRORS: Record<keyof FormValuesT, string> = {
  password: "",
  confirmPassword: "",
}

interface Props {
  token: string
}

export default function ResetPasswordForm({ token }: Props) {
  const [formValues, setFormValues] = useState(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState(INITIALERRORS)

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = resetPasswordSchema.safeParse(formValues)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)

      return setErrors({
        ...INITIALERRORS,
        password: cause.properties?.password?.errors[0] ?? "",
        confirmPassword: cause.properties?.confirmPassword?.errors[0] ?? "",
      })
    }

    const { success, error } = await resetPasswordReq({
      token,
      newPassword: formValues.password,
    })

    if (!success) {
      showToast("error", error ?? "No se pudo restablecer la contraseña.")
      return
    }

    showToast("success", "Contraseña actualizada correctamente.")

    setFormValues(DEFAULTFORMVALUES)
  }

  const onChangeField =
    (field: keyof FormValuesT) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col">
      <Input
        label="Nueva contraseña"
        type="password"
        autoComplete="new-password"
        className="w-full"
        errorMessage={errors.password}
        onChange={onChangeField("password")}
        value={formValues.password}
      />

      <Input
        className="w-full"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        errorMessage={errors.confirmPassword}
        onChange={onChangeField("confirmPassword")}
        value={formValues.confirmPassword}
      />

      <Button
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm mt-2">
        Restablecer contraseña
      </Button>
    </form>
  )
}
