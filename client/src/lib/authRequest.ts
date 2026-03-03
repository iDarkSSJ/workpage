import type z from "zod"
import { authClient } from "./authClient"
import { getErrorMessage } from "./errorCodes"
import {
  changePasswordSchema,
  userLoginSchema,
  userSignUpSchema,
} from "../validations/userSchema"

type ApiResult = {
  success: boolean
  error?: string
}

const AUTH_URL = import.meta.env.VITE_AUTH_URL as string
const CLIENT_URL = import.meta.env.VITE_CLIENT_URL as string

export const verifyEmailReq = async () => {
  try {
    const response = await fetch(`${AUTH_URL}/request-email-verification`, {
      method: "POST",
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Surgió un error enviando el correo.",
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error enviando el correo.",
    }
  }
}

export const updateUserReq = async (name: string) => {
  try {
    const { error } = await authClient.updateUser({
      name,
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error actualizando el usuario.",
    }
  }
}

export const completeRoleReq = async (role: string): Promise<ApiResult> => {
  try {
    const response = await fetch(`${AUTH_URL}/complete-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ role }),
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "No se pudo procesar la solicitud.",
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error eliminando la cuenta.",
    }
  }
}

export const deleteAccountReq = async (): Promise<ApiResult> => {
  try {
    const response = await fetch(`${AUTH_URL}/delete-account`, {
      method: "POST",
      credentials: "include",
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "No se pudo procesar la solicitud.",
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error eliminando la cuenta.",
    }
  }
}

export const linkGoogleAccountReq = async (): Promise<ApiResult> => {
  try {
    const { error } = await authClient.linkSocial({
      provider: "google",
      callbackURL: `${CLIENT_URL}/dashboard`,
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un enlazando la cuenta.",
    }
  }
}

export const resetPasswordReq = async ({
  newPassword,
  token,
}: {
  newPassword: string
  token: string
}): Promise<ApiResult> => {
  try {
    const { error } = await authClient.resetPassword({
      newPassword,
      token,
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error cambiando la contraseña.",
    }
  }
}

export const forgotPasswordReq = async ({
  email,
}: {
  email: string
}): Promise<ApiResult> => {
  try {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${CLIENT_URL}/reset-password`,
    })

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error cambiando la contraseña.",
    }
  }
}

export const changePasswordReq = async (
  data: z.infer<typeof changePasswordSchema>,
): Promise<ApiResult> => {
  try {
    const { error } = await authClient.changePassword(data)

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error cambiando la contraseña.",
    }
  }
}

export const signUpReq = async (
  data: z.infer<typeof userSignUpSchema>,
): Promise<ApiResult> => {
  try {
    const { error } = await authClient.signUp.email(data)

    if (error) {
      return { success: false, error: getErrorMessage(error.code) }
    }

    return { success: true }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: "Error creando la cuenta, Por favor intenta de nuevo.",
    }
  }
}

export const signInReq = async (
  data: z.infer<typeof userLoginSchema>,
): Promise<ApiResult> => {
  try {
    const { error } = await authClient.signIn.email(data)

    console.log(error)
    if (error) {
      return { success: false, error: getErrorMessage(error.code) }
    }

    return { success: true }
  } catch (err) {
    console.error(err)
    return {
      success: false,
      error: "Error iniciando sesión, por favor intenta de nuevo.",
    }
  }
}

type SignOutResult = { success: true } | { success: false; error: string }

export const signOutReq = async (): Promise<SignOutResult> => {
  try {
    const { error } = await authClient.signOut()

    if (error) {
      return {
        success: false,
        error: getErrorMessage(error.code),
      }
    }

    return { success: true }
  } catch (err) {
    console.error(err)

    return {
      success: false,
      error: "Surgió un error cerrando sesión.",
    }
  }
}
