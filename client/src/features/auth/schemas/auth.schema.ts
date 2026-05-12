import { z } from "zod"

const passwordRegex =
  /^(?=.*?[A-ZÑ])(?=.*?[a-zñ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-zÑñ0-9#?!@$%^&*-]{8,32}$/

const nameRegex = /^(?=.{1,50}$)[\p{L}]+(?:\s[\p{L}]+)*$/u

export const nameSchema = z
  .string()
  .min(1, "Debes escribir tu nombre")
  .max(50, "Tu nombre no puede tener mas de 50 caracteres.")
  .regex(/[\p{L}]/u, "El nombre debe contener letras.")
  .regex(/^\S/, "No se permiten espacios al inicio.")
  .regex(/\S$/, "No se permiten espacios al final.")
  .regex(/^(?!.*\s{2})/, "No se permiten espacios dobles.")
  .regex(nameRegex, "El nombre contiene caracteres inválidos.")

const passwordSchema = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres")
  .max(32, "La contraseña no puede tener más de 32 caracteres")
  .regex(/[A-ZÑ]/, "Debe contener al menos una letra mayúscula (A-Z o Ñ)")
  .regex(/[a-zñ]/, "Debe contener al menos una letra minúscula (a-z o ñ)")
  .regex(/[0-9]/, "Debe contener al menos un número (0-9)")
  .regex(
    /[#?!@$%^&*+-]/,
    "Debe contener al menos un carácter especial (# ? ! @ $ % ^ & * -)",
  )
  .regex(/^\S*$/, "No se permiten espacios")
  .regex(passwordRegex, "La contraseña contiene un carácter inválido")

export const signUpSchema = z.object({
  name: nameSchema,
  email: z.email("No es un Email valido."),
  password: passwordSchema,
  role: z.enum(["contractor", "freelance"], {
    message: "Opción no válida, debe ser Contratante o Freelance.",
  }),
})

export const signInSchema = z.object({
  email: z.email("No es un Email valido."),
  password: z.string().min(1, "La contraseña es obligatoria"),
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
  currentPassword: z.string().min(1, "La contraseña actual es obligatoria"),
  revokeOtherSessions: z.boolean().optional(),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>

export type ChangePasswordData = z.infer<typeof changePasswordSchema>
