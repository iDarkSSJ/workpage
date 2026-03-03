import type { ErrorTypes } from "./authClient"

export const errorCodes = {
  USER_ALREADY_EXISTS: {
    es: "Este usuario ya fue registrado.",
  },
  USER_NOT_FOUND: {
    es: "El usuario no se ha encontrado.",
  },
  USER_EMAIL_NOT_FOUND: {
    es: "No se ha encontrado el correo de este usuario.",
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    es: "Este correo ya fue registrado anteriormente.",
  },
  PASSWORD_TOO_LONG: {
    es: "La contraseña ingresada es muy larga.",
  },
  PASSWORD_TOO_SHORT: {
    es: "La contraseña ingresada es muy corta.",
  },
  MISSING_FIELD: {
    es: "Falta un campo por llenar.",
  },
  INVALID_PASSWORD: {
    es: "La contraseña ingresada no es valida.",
  },
  INVALID_EMAIL_OR_PASSWORD: {
    es: "La contraseña o el correo ingresado no son validos.",
  },
  INVALID_EMAIL: {
    es: "El correo ingresado no es valido.",
  },
  FAILED_TO_UPDATE_USER: {
    es: "Hubo un error actualizando el usuario.",
  },
  FAILED_TO_GET_USER_INFO: {
    es: "Hubo un error obteniendo la información de usuario.",
  },
  FAILED_TO_CREATE_USER: {
    es: "Hubo un error creando el usuario.",
  },
  VALIDATION_ERROR: {
    es: "Hubo un error validando los datos entregados.",
  },
  INVALID_TOKEN: {
    es: "Error validando el token.",
  },
  EMAIL_NOT_VERIFIED: {
    es: "Correo no verificado, revisa tu bandeja de entrada para verificar tu correo.",
  },
} satisfies ErrorTypes

export const getErrorMessage = (code?: string): string =>
  errorCodes[code as keyof typeof errorCodes]?.es ??
  "Ocurrió un error desconocido."
