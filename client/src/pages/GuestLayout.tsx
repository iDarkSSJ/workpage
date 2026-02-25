import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/AuthContext"

export default function GuestLayout() {
  const { data: session, isPending } = useAuth()

  if (isPending) return null
  if (session) return <Navigate to="/dashboard" replace />

  return <Outlet />
}
