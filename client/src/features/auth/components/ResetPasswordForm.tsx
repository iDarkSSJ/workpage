import { useState } from "react"
import { useNavigate } from "react-router"
import Button from "../../../components/Button"
import Input from "../../../components/ui/Input"
import { z } from "zod"
import { useResetPassword } from "../api/useAuth"
import { resetPasswordSchema } from "../schemas/auth.schema"

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
  const { mutate, isPending: isLoading } = useResetPassword()
  const navigate = useNavigate()

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = resetPasswordSchema.safeParse(formValues)

    if (!validation.success) {
      const cause = validation.error.flatten().fieldErrors

      return setErrors({
        ...INITIALERRORS,
        password: cause.password?.[0] ?? "",
        confirmPassword: cause.confirmPassword?.[0] ?? "",
      })
    }

    mutate({
      token,
      newPassword: formValues.password,
    }, {
      onSuccess: () => {
        setFormValues(DEFAULTFORMVALUES)
        navigate("/login") // Ir a login tras éxito
      }
    })
  }

  const onChangeField =
    (field: keyof FormValuesT) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }))

      if (errors[field]) {
        setErrors((prev: typeof INITIALERRORS) => ({ ...prev, [field]: "" }))
      }
    }

  return (
    <form
      onSubmit={onSubmitForm}
      className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
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
        disabled={isLoading}
        aria-disabled={isLoading}
        type="submit"
        btnType="primary"
        className="w-full py-3 text-base font-bold mt-2">
        {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
      </Button>
    </form>
  )
}
