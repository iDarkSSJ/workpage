import { useState } from "react"
import Input from "../ui/Input"
import Radio from "../ui/Radio"
import Button from "../Button"
import Separator from "../ui/Separator"
import GoogleBtn from "./GoogleBtn"
import type { SetURLSearchParams } from "react-router"
import { authClient } from "../../lib/authClient"
import { userSignUpSchema } from "../../validations/userSchema"
import z from "zod"
import { showToast } from "../showToast"
import { getErrorMessage } from "../../lib/errorCodes"

interface RegisterFormProps {
  rol: string
  setSearchParams: SetURLSearchParams
}

type UserType = "contractor" | "freelance"

const DEFAULTFORMVALUES = {
  userType: "" as UserType,
  name: "",
  email: "",
  password: "",
}

const INITIALERRORS = {
  userType: "",
  name: "",
  email: "",
  password: "",
}

export default function RegisterForm({
  rol,
  setSearchParams,
}: RegisterFormProps) {
  const [formValues, setFormValues] = useState({
    ...DEFAULTFORMVALUES,
    userType: rol,
  })
  const [errors, setErrors] = useState(INITIALERRORS)

  const onSubmitForm = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validation = userSignUpSchema.safeParse(formValues)

    if (!validation.success) {
      const cause = z.treeifyError(validation.error)

      return setErrors({
        ...INITIALERRORS,
        name: cause.properties?.name?.errors[0] ?? "",
        userType: cause.properties?.userType?.errors[0] ?? "",
        email: cause.properties?.email?.errors[0] ?? "",
        password: cause.properties?.password?.errors[0] ?? "",
      })
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email: formValues.email,
        password: formValues.password,
        name: formValues.name,
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
      if (field === "userType") setSearchParams({ rol: e.target.value })
    }

  return (
    <form onSubmit={onSubmitForm} className="flex flex-col gap-6">
      <div className="flex flex-col">
        <Input
          errorMessage={errors.name}
          onChange={onChangeField("name")}
          label="Nombre Completo"
          className="w-full"
          autoComplete="name"
        />
        <Input
          errorMessage={errors.email}
          onChange={onChangeField("email")}
          label="Email"
          type="email"
          className="w-full"
          autoComplete="email"
        />
        <Input
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
            checked={formValues.userType === "contractor"}
            onChange={onChangeField("userType")}
            name="userType"
            value="contractor"
            label="Contratante"
          />
          <Radio
            checked={formValues.userType === "freelance"}
            onChange={onChangeField("userType")}
            name="userType"
            value="freelance"
            label="Freelance"
          />
        </div>
        {errors.userType && (
          <span className="text-danger text-sm min-h-5 block">
            {errors.userType}
          </span>
        )}
      </div>

      <Button
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
