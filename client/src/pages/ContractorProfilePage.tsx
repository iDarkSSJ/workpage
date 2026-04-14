import { useParams, useNavigate } from "react-router"
import { MapPin, Globe, Star, Building2, ChevronLeft } from "lucide-react"
import Button from "../components/Button"
import Link from "../components/Link"
import Card from "../components/Card"
import ReviewsList from "../features/reviews/components/ReviewsList"
import { calculateAverageRating } from "../features/reviews/utils/reviews.utils"
import { useContractorProfile } from "../features/profiles/api/useProfiles.api"
import { getCountryName } from "../utils/countryHelper"
import { handleSafeBack } from "../utils/navigation"

export default function ContractorProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: profile, isLoading, error } = useContractorProfile(id)

  if (isLoading) return null

  if (error || !profile) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-zinc-400 text-lg">
          {error instanceof Error ? error.message : "Perfil no encontrado"}
        </p>
        <Button btnType="primary" onClick={() => handleSafeBack(navigate)}>
          <ChevronLeft size={16} className="inline mr-1" />
          Volver
        </Button>
      </div>
    )
  }

  const ratingInfo = calculateAverageRating(profile.reviews)

  return (
    <div className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          btnType="primary"
          onClick={() => handleSafeBack(navigate)}
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
                {ratingInfo && (
                  <span className="flex items-center gap-1 text-sm text-amber-400 font-semibold">
                    <Star size={18} fill="currentColor" />
                    {ratingInfo.average}
                    <span className="text-zinc-500 font-normal">
                      ({ratingInfo.count})
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
                    <MapPin size={16} />
                    {getCountryName(profile.country)}
                  </span>
                )}
                {profile.websiteUrl && (
                  <Link
                    path={profile.websiteUrl}
                    isExternal
                    target="_blank"
                    className="flex items-center gap-1 hover:text-primary transition-colors">
                    <Globe size={16} />
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

        <ReviewsList reviews={profile.reviews ?? []} />
      </div>
    </div>
  )
}
