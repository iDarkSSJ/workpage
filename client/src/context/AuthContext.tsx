/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, type ReactNode } from "react"
import { authClient } from "../lib/authClient"

type SessionHook = ReturnType<typeof authClient.useSession>

const AuthContext = createContext<SessionHook | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessionHook = authClient.useSession()

  return (
    <AuthContext.Provider value={sessionHook}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return ctx
}
