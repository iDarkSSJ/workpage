import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import { useLoading } from "../context/LoadingContext"
import { MapPin, Globe, Star, Building2, ChevronLeft } from "lucide-react"
import { getContractorProfile } from "../lib/profilesApi"
import Button from "../components/Button"
import Link from "../components/Link"
import type { ContractorProfile } from "../types/profiles"
import Card from "../components/Card"
import FreelancerReviewsSection from "../components/pieces/FreelancerReviewsSection"
import { showToast } from "../components/showToast"

export default function ContractorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [profile, setProfile] = useState<ContractorProfile | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const loadProfile = async () => {
      setLoading(true)
      try {
        const result = await getContractorProfile(id)
        if (!result.success) {
          showToast("error", result.error)
          return
        }
        setProfile(result.data)
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error inesperado"
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [id, setLoading])

  if (error || !profile) {
    return (
      <main className="min-h-dvh flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-zinc-400 text-lg">
          {error ?? "Perfil no encontrado"}
        </p>
        <Button btnType="primary" onClick={() => navigate("/dashboard")}>
          <ChevronLeft size={16} className="inline mr-1" />
          Volver
        </Button>
      </main>
    )
  }

  // calcular rating promedio
  let avgRating: string | null = null
  if (profile.reviews && profile.reviews.length > 0) {
    let sum = 0
    for (const r of profile.reviews) {
      sum += parseFloat(r.rating)
    }
    avgRating = (sum / profile.reviews.length).toFixed(1)
  }

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          btnType="primary"
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-1 text-zinc-400 hover:text-primary transition-colors text-sm cursor-pointer">
          <ChevronLeft size={16} />
          Volver
        </Button>

        {/* cabecera */}
        <Card className="w-full">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Building2 size={34} className="text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-100">
                  {profile.companyName ?? profile.user?.name ?? "Contratante"}
                </h1>
                {avgRating && (
                  <span className="flex items-center gap-1 text-sm text-amber-400 font-semibold">
                    <Star size={14} fill="currentColor" />
                    {avgRating}
                    <span className="text-zinc-500 font-normal">
                      ({profile.reviews!.length})
                    </span>
                  </span>
                )}
              </div>

              {profile.user?.name && profile.companyName && (
                <p className="text-zinc-400 text-sm mt-0.5">
                  {profile.user.name}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                {profile.country && (
                  <span className="flex items-center gap-1">
                    <MapPin size={13} />
                    {profile.country}
                  </span>
                )}
                {profile.websiteUrl && (
                  <Link
                    path={profile.websiteUrl}
                    isExternal
                    target="_blank"
                    className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Globe size={13} />
                    Sitio web
                  </Link>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="text-zinc-300 mt-5 text-sm leading-relaxed border-t border-zinc-700/50 pt-5">
              {profile.bio}
            </p>
          )}
        </Card>

        {profile.reviews && profile.reviews.length > 0 && (
          <FreelancerReviewsSection reviews={profile.reviews} />
        )}
      </div>
    </main>
  )
}
