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
  baseURL: import.meta.env.VITE_API_BASE_URL, // The base URL of your auth server
  advanced: {
    crossSubdomainCookies: {
      enabled: true,
      domain: ".goash.site",
    },
  },
})
