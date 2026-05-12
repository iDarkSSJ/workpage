import { Navigate, useLocation } from "react-router"
import { useMyProfile } from "../../features/profiles/api/useProfiles.api"

export default function ProfileGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { pathname } = useLocation()

  const { data, isLoading, isError } = useMyProfile()

  if (isLoading) return null

  if (isError) return <Navigate to="/login" replace />

  const hasFreelancer = Boolean(data?.freelancerProfile)
  const hasContractor = Boolean(data?.contractorProfile)

  const hasNone = !hasFreelancer && !hasContractor

  if (hasNone && pathname !== "/profile/setup") {
    return <Navigate to="/profile/setup" replace />
  }
  if (!hasNone && pathname === "/profile/setup") {
    return <Navigate to="/dashboard/edit-profile" replace />
  }

  return <>{children}</>
}
