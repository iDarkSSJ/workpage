import { api } from "../../../lib/api"
import { authClient } from "../../../lib/authClient"
import type {
  SignInData,
  SignUpData,
} from "../schemas/auth.schema"
import { getErrorMessage } from "../utils/errorCodes"

export const signUpReq = async (data: SignUpData) => {
  const { data: responseData, error } = await authClient.signUp.email(data)

  if (error) {
    throw new Error(getErrorMessage(error.code))
  }

  return responseData
}

export const signInReq = async (data: SignInData) => {
  const { data: responseData, error } = await authClient.signIn.email(data)

  if (error) {
    throw new Error(getErrorMessage(error.code))
  }

  return responseData
}

export const googleSignInReq = async (callbackURL: string) => {
  const { data, error } = await authClient.signIn.social({
    provider: "google",
    callbackURL,
  })

  if (error) {
    throw new Error(getErrorMessage(error.code))
  }

  return data
}

export const verifyEmailReq = async () => {
  return api.post("/auth/request-email-verification", {})
}


export const deleteAccountReq = async () => {
  return api.post("/auth/delete-account", {})
}

export const resetPasswordReq = async ({
  newPassword,
  token,
}: {
  newPassword: string
  token: string
}) => {
  const { error } = await authClient.resetPassword({ newPassword, token })
  if (error) {
    throw new Error(getErrorMessage(error.code))
  }
  return true
}

export const forgotPasswordReq = async ({ email }: { email: string }) => {
  return api.post("/auth/request-password-reset", { email })
}

export const updateUserReq = async (name: string) => {
  const { error } = await authClient.updateUser({ name })
  if (error) throw new Error(getErrorMessage(error.code))
  return true
}


