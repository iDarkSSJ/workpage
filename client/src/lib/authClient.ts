import { inferAdditionalFields } from "better-auth/client/plugins"
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
  sessionOptions: { refetchOnWindowFocus: false },
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
      },
    }),
  ],
  baseURL: "http://localhost:3000", // The base URL of your auth server
})
