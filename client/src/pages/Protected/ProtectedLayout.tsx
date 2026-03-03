import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../../context/AuthContext"
import VerifyEmailCard from "../../components/pieces/VerifyEmailCard"

export default function ProtectedLayout() {
  const { data: session, isPending } = useAuth()
  const { pathname } = useLocation()

  if (isPending) return null

  if (!session) return <Navigate to="/login" replace />

  const isVerified = session.user.emailVerified

  if (!isVerified) {
    return <VerifyEmailCard />
  }

  const hasRole = Boolean(session.user.role)
  const isCompletingProfile = pathname === "/complete-profile"

  if (!hasRole && !isCompletingProfile) {
    return <Navigate to="/complete-profile" replace />
  }

  if (hasRole && isCompletingProfile) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
