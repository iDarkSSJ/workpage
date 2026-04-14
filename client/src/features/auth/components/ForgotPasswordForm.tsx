import { useState } from "react"
import Button from "../../../components/Button"
import Input from "../../../components/ui/Input"
import { z } from "zod"
import { useForgotPassword } from "../api/useAuth"

const DEFAULTFORMVALUES = {
  email: "",
}

const INITIALERRORS = {
  email: "",
}

export default function ForgotPasswordForm() {
  const [formValues, setFormValues] = useState(DEFAULTFORMVALUES)
  const [errors, setErrors] = useState(INITIALERRORS)
  
  const forgotMut = useForgotPassword()

  const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = z.email().safeParse(formValues.email)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      return setErrors({
        ...INITIALERRORS,
        email: cause.errors[0] ?? "",
      })
    }

    forgotMut.mutate(formValues, {
      onSuccess: () => {
        setFormValues(DEFAULTFORMVALUES)
      }
    })
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
        disabled={forgotMut.isPending}
        aria-disabled={forgotMut.isPending}
        type="submit"
        btnType="secondary"
        className="w-full py-2.5 text-sm">
        Enviar enlace
      </Button>
    </form>
  )
}

