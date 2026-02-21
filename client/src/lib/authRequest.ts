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

export const resetPasswordReq = async ({
  newPassword,
  token,
}: {
  newPassword: string
  token: string
}) => {
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

export const forgotPasswordReq = async ({ email }: { email: string }) => {
  try {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "http://localhost:5173/reset-password", // TODO: USE .ENV INSTEAD
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
