import { Navigate, useLocation } from "react-router"
import { useEffect, useState } from "react"
import { getMyProfiles } from "../../lib/profilesApi"
import { useLoading } from "../../context/LoadingContext"
import { showToast } from "../showToast"

// Protege las rutas que requieren perfil aasi obligamos al usuario a crear un perfil antes de acceder a ellas

export default function ProfileGuard({
  children,
}: {
  children: React.ReactNode
}) {
  const { pathname } = useLocation()
  const { setLoading } = useLoading()
  const [hasChecked, setHasChecked] = useState(false)
  const [hasFreelancer, setHasFreelancer] = useState(false)
  const [hasContractor, setHasContractor] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)

    const fetchProfiles = async () => {
      try {
        const res = await getMyProfiles()

        if (!res.success) {
          showToast("error", res.error)
          return
        }

        if (!active) return
        setHasFreelancer(Boolean(res.data.freelancerProfile))
        setHasContractor(Boolean(res.data.contractorProfile))
      } catch (err) {
        console.error(err)
      } finally {
        if (active) {
          setHasChecked(true)
          setLoading(false)
        }
      }
    }

    fetchProfiles()

    return () => {
      active = false
    }
  }, [setLoading])

  if (!hasChecked) return null

  const hasNone = !hasFreelancer && !hasContractor

  // Logica 1: Si no tiene NINGUN perfil (nuevo usuario total) y NO esta en la pagina de setup
  if (hasNone && pathname !== "/profile/setup") {
    return <Navigate to="/profile/setup" replace />
  }

  // Logica 2: Si ya tiene AL MENOS UN perfil y esta tratando de entrar a Setup a crear uno mas
  if (!hasNone && pathname === "/profile/setup") {
    return <Navigate to="/dashboard/edit-profile" replace />
  }

  return <>{children}</>
}
