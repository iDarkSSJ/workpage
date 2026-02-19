import { createAuthClient } from "better-auth/react"

// https://www.better-auth.com/docs/concepts/client#error-codes
export type ErrorTypes = Partial<
  Record<
    keyof typeof authClient.$ERROR_CODES,
    {
      es: string
    }
  >
>

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // The base URL of your auth server
})
