import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router"
import { showToast } from "../../../components/showToast"
import {
  deleteAccountReq,
  forgotPasswordReq,
  googleSignInReq,
  resetPasswordReq,
  signInReq,
  signUpReq,
  updateUserReq,
} from "./auth.api"

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordReq,
    onSuccess: () =>
      showToast("success", "Email de recuperación enviado. Revisa tu bandeja."),
    onError: (error) => showToast("error", error.message),
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordReq,
    onSuccess: () => showToast("success", "Contraseña restablecida correctamente."),
    onError: (error) => showToast("error", error.message),
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateUserReq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      showToast("success", "Nombre actualizado correctamente.")
    },
    onError: (error) => showToast("error", error.message),
  })
}


export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: deleteAccountReq,
    onSuccess: () => {
      showToast(
        "success",
        "Se ha enviado un correo para confirmar la eliminación.",
      )
    },
    onError: (error) => showToast("error", error.message),
  })
}

export const useSignUp = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signUpReq,
    onSuccess: (_, variables) => {
      showToast("success", "Cuenta creada correctamente.")

      if (variables.role === "contractor") {
        navigate("/profile/setup?type=contractor")
      } else {
        navigate("/profile/setup?type=freelance")
      }
    },
    onError: (error) => {
      showToast("error", error.message || "Error al crear la cuenta.")
    },
  })
}

export const useSignIn = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: signInReq,
    onSuccess: () => {
      showToast("success", "Sesión iniciada correctamente.")
      navigate("/dashboard")
    },
    onError: (error) => {
      showToast("error", error.message || "Error al iniciar sesión.")
    },
  })
}

export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: googleSignInReq,
    onError: (error) => {
      showToast(
        "error",
        error.message || "Hubo un error iniciando sesión con Google.",
      )
    },
  })
}
