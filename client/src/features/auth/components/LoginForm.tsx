import { useState } from "react"
import { z } from "zod"
import Button from "../../../components/Button"
import Input from "../../../components/ui/Input"
import Separator from "../../../components/ui/Separator"
import GoogleBtn from "./GoogleBtn"
import Link from "../../../components/Link"
import { signInSchema } from "../schemas/auth.schema"
import { useSignIn } from "../api/useAuth"

const INITIAL_ERRORS = {
  email: "",
  password: "",
}

export default function LoginForm() {
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  const { mutate: signIn, isPending } = useSignIn()

  const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = signInSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)
      setErrors({
        email: cause.properties?.email?.errors[0] ?? "",
        password: cause.properties?.password?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)
    signIn(validation.data)
  }

  const handleFormInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    const fieldName = target.name as keyof typeof INITIAL_ERRORS

    if (fieldName && errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  return (
    <form
      onSubmit={onSubmitForm}
      onInput={handleFormInput}
      className="bg-zinc-900/50 p-6 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
      <div className="flex flex-col">
        <Input
          name="email"
          label="Email"
          type="email"
          errorMessage={errors.email}
          className="w-full"
          autoComplete="email"
        />
        <Input
          name="password"
          label="Contraseña"
          type="password"
          maxLength={32}
          errorMessage={errors.password}
          className="w-full"
          autoComplete="current-password"
        />
      </div>

      <div className="gap-2 flex flex-col mt-2">
        <Link
          path="/forgot-password"
          className="ml-auto text-sm text-zinc-400 hover:text-primary">
          ¿Olvidaste la contraseña?
        </Link>

        <Button
          disabled={isPending}
          type="submit"
          btnType="primary"
          className="w-full py-3 text-base font-bold mt-2">
          {isPending ? "Iniciando Sesión..." : "Iniciar Sesión"}
        </Button>

        <div className="flex flex-col gap-4 mt-2">
          <Separator label="o continuar con" />
          <GoogleBtn />
        </div>
      </div>
    </form>
  )
}
