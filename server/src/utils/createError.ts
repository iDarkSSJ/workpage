// Error type personalizado para la app y diferenciar errores
export type AppError = Error & {
  statusCode: number
  isAppError: boolean
}

export const createError = (
  message: string,
  statusCode: number = 400,
): AppError => {
  const error = new Error(message) as AppError
  error.statusCode = statusCode
  error.isAppError = true
  return error
}
