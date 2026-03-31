import { Navigate, Outlet } from "react-router"
import { useAuth } from "../../context/AuthContext"
import VerifyEmailCard from "../../components/pieces/VerifyEmailCard"
import ProfileGuard from "../../components/guards/ProfileGuard"

export default function ProtectedLayout() {
  const { data: session, isPending } = useAuth()

  if (isPending) return 

  if (!session) return <Navigate to="/login" replace />

  const isVerified = session.user.emailVerified

  if (!isVerified) {
    return <VerifyEmailCard />
  }

  return (
    <ProfileGuard>
      <Outlet />
    </ProfileGuard>
  )
}
