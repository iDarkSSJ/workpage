import { useState } from "react"
import { z } from "zod"
import Input from "../../../components/ui/Input"
import Radio from "../../../components/ui/Radio"
import Button from "../../../components/Button"
import Separator from "../../../components/ui/Separator"
import type { SetURLSearchParams } from "react-router"
import { useSignUp } from "../api/useAuth"
import { signUpSchema } from "../schemas/auth.schema"
import GoogleBtn from "./GoogleBtn"

interface RegisterFormProps {
  role: string
  setSearchParams: SetURLSearchParams
}

const INITIAL_ERRORS = {
  name: "",
  email: "",
  password: "",
  role: "",
}

export default function RegisterForm({
  role,
  setSearchParams,
}: RegisterFormProps) {
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  const { mutate: signUp, isPending } = useSignUp()

  const handleFormInput = (e: React.InputEvent<HTMLFormElement>) => {
    const target = e.target as HTMLInputElement
    const fieldName = target.name as keyof typeof INITIAL_ERRORS

    if (fieldName && errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }))
    }
  }

  const onSubmitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const rawData = Object.fromEntries(formData.entries())

    const validation = signUpSchema.safeParse(rawData)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)

      setErrors({
        name: cause.properties?.name?.errors[0] ?? "",
        email: cause.properties?.email?.errors[0] ?? "",
        password: cause.properties?.password?.errors[0] ?? "",
        role: cause.properties?.role?.errors[0] ?? "",
      })
      return
    }

    setErrors(INITIAL_ERRORS)
    signUp(validation.data)
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ role: e.target.value })
    if (errors.role) setErrors((prev) => ({ ...prev, role: "" }))
  }

  return (
    <form
      onInput={handleFormInput}
      onSubmit={onSubmitForm}
      className="bg-zinc-900/50 p-7 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col gap-6">
      <div className="flex flex-col">
        <Input
          name="name"
          label="Nombre Completo"
          errorMessage={errors.name}
          className="w-full"
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-3 p-4 rounded-xl bg-zinc-950/50 border border-zinc-800">
        <span className="text-base font-semibold text-zinc-200">
          ¿Para qué vas a usar la plataforma?
        </span>

        <div className="flex flex-col gap-2">
          <Radio
            name="role"
            value="contractor"
            label="Quiero contratar talento"
            defaultChecked={role === "contractor"}
            onChange={handleRoleChange}
          />
          <Radio
            name="role"
            value="freelance"
            label="Quiero buscar trabajo"
            defaultChecked={role === "freelance"}
            onChange={handleRoleChange}
          />
        </div>
        {errors.role && (
          <span className="text-danger text-sm min-h-5 block">
            {errors.role}
          </span>
        )}
      </div>

      <Button
        disabled={isPending}
        type="submit"
        btnType="primary"
        className="w-full py-3 text-base font-bold">
        {isPending ? "Creando cuenta..." : "Crear Cuenta"}
      </Button>

      <div className="flex flex-col gap-4">
        <Separator label="o continuar con" />
        <GoogleBtn />
      </div>
    </form>
  )
}
