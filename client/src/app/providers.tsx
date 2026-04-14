import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import { AuthProvider } from "../context/AuthContext"
import AppLoader from "../components/AppLoader"
import type { ReactNode } from "react"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 },
  },
})

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLoader />
        <Toaster position="top-right" />
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}
