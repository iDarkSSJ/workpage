import { Navigate, Outlet } from "react-router"
import { useAuth } from "../../context/AuthContext"
import VerifyEmailCard from "../../features/auth/components/VerifyEmailCard"
import ProfileGuard from "../../components/guards/ProfileGuard"

export default function ProtectedLayout() {
  const { data: session, isPending } = useAuth()

  if (isPending) return

  if (!session) return <Navigate to="/login" replace />

  const isVerified = session.user.emailVerified

  if (!isVerified) {
    return (
      <div className="flex-1 w-full flex flex-col items-center justify-center gap-8 bg-linear-to-b from-zinc-950 to-zinc-900 px-4 py-14 min-h-[calc(100vh-4rem)]">
        <VerifyEmailCard />
      </div>
    )
  }

  return (
    <ProfileGuard>
      <Outlet />
    </ProfileGuard>
  )
}
