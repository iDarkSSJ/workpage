import z from "zod"

// Password Regex:
// minimo 8 char y maximo 32 char
// Al menos una letra en mayuscula A-Z o Ñ
// Al menos una letra en minuscula a-z o ñ
// Al menos un digito 0-9
// Al menos un caracter especial ( # ? ! @ $ % ^ & * -)
// no permite espacios
// no permite emojis ❎
//                              - jose luis

const passwordRegex =
  /^(?=.*?[A-ZÑ])(?=.*?[a-zñ])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])[A-Za-zÑñ0-9#?!@$%^&*-]{8,32}$/

// Nombre Regex
// Minimo 1 char, Maximo 50
// Puede usar cualquier letra de cualquier idioma
// Incluyendo Letras latinas, acentos. çñ, Japonés, Coreano, Chino, Arabe, Cirilico y cualquier Lenguaje valido
// NO permite emojis ❎
// NO permite dobles espacios "A  b"
// NO permite Espacios al inicio o al final " Nombre" "Nombre "
//                              - jose luis

const nameRegex = /^(?=.{1,50}$)[\p{L}]+(?:\s[\p{L}]+)*$/u

export const nameSchema = z
  .string()
  .min(1, "Debes escribir tu nombre")
  .max(50, "Tu nombre no puede tener mas de 50 caracteres.")
  .regex(/[\p{L}]/u, "El nombre debe contener letras.")
  .regex(/^\S/, "No se permiten espacios al inicio.")
  .regex(/\S$/, "No se permiten espacios al final.")
  .regex(/^(?!.*\s{2})/, "No se permiten espacios dobles.")
  // Validación global: solo permite letras Unicode y espacios simples
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
  // Validación global: solo permite los caracteres del set completo
  .regex(passwordRegex, "La contraseña contiene un carácter inválido")

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  })

export const userLoginSchema = z.object({
  email: z.email("No es un Email valido."),
  password: passwordSchema,
})

export const userSignUpSchema = z.object({
  name: nameSchema,
  role: z.enum(
    ["contractor", "freelance"],
    "Opción no válida, debe ser Contratante o Freelance.",
  ),
  email: z.email("No es un Email valido."),
  password: passwordSchema,
})

export const changePasswordSchema = z.object({
  newPassword: passwordSchema,
  currentPassword: passwordSchema,
  revokeOtherSessions: z.boolean().optional(),
})
