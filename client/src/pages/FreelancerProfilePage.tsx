import { useParams, useNavigate } from "react-router"
import { MapPin, Globe, Star, ChevronLeft, DollarSign, MessageSquare } from "lucide-react"
import Button from "../components/Button"
import Link from "../components/Link"
import Card from "../components/Card"
import FreelancerSkillsSection from "../features/profiles/components/FreelancerSkillsSection"
import ReviewsList from "../features/reviews/components/ReviewsList"
import { calculateAverageRating } from "../features/reviews/utils/reviews.utils"
import CertificationsSection from "../features/profiles/components/CertificationsSection"
import ExperiencesSection from "../features/profiles/components/ExperiencesSection"
import PortfolioSection from "../features/profiles/components/PortfolioSection"
import { useFreelancerProfile } from "../features/profiles/api/useProfiles.api"
import { handleSafeBack } from "../utils/navigation"
import { formatAmount } from "../utils/currency"
import { getCountryName } from "../utils/countryHelper"
import { useAuth } from "../context/AuthContext"
import { useCreateConversation } from "../features/chat/api/useChat"

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const LinkedinIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

export default function FreelancerProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: session } = useAuth()
  const createChatMut = useCreateConversation()

  const { data: profile, isLoading, error } = useFreelancerProfile(id)

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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back */}
        <Button
          btnType="primary"
          onClick={() => handleSafeBack(navigate)}
          className="flex items-center gap-1 text-zinc-400 hover:text-primary transition-colors text-sm cursor-pointer">
          <ChevronLeft size={16} />
          Volver
        </Button>

        {/* Header */}
        <Card className="w-full relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-2xl font-bold text-primary">
              {profile.user?.image ? (
                <img
                  src={profile.user.image}
                  alt={profile.user.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                (profile.user?.name?.charAt(0).toUpperCase() ?? "?")
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold text-zinc-100">
                  {profile.user?.name ?? "Freelancer"}
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

              {profile.category && (
                <p className="text-primary font-medium mt-0.5">
                  {profile.category}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mt-2 text-sm text-zinc-400">
                {profile.country && (
                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {getCountryName(profile.country)}
                  </span>
                )}
                {profile.hourlyRate && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <DollarSign size={16} />
                    {formatAmount(profile.hourlyRate)}/hr
                  </span>
                )}
              </div>

              {/* Links */}
              <div className="flex gap-3 mt-3">
                {profile.linkedinUrl && (
                  <Link
                    path={profile.linkedinUrl}
                    isExternal
                    target="_blank"
                    className="text-zinc-400 hover:text-primary transition-colors">
                    <LinkedinIcon size={18} />
                  </Link>
                )}
                {profile.githubUrl && (
                  <Link
                    path={profile.githubUrl}
                    isExternal
                    target="_blank"
                    className="text-zinc-400 hover:text-primary transition-colors">
                    <GithubIcon size={18} />
                  </Link>
                )}
                {profile.websiteUrl && (
                  <Link
                    path={profile.websiteUrl}
                    isExternal
                    target="_blank"
                    className="text-zinc-400 hover:text-primary transition-colors">
                    <Globe size={18} />
                  </Link>
                )}
              </div>
            </div>

            {/* Actions */}
            {session && session.user.id !== profile.userId && (
              <div className="w-full md:w-auto md:ml-auto mt-2">
                <Button
                  btnType="primary"
                  disabled={createChatMut.isPending}
                  onClick={() => {
                    createChatMut.mutate(
                      { receiverId: profile.userId },
                      {
                        onSuccess: (conversation) => navigate(`/dashboard/chat/${conversation.id}`)
                      }
                    )
                  }}
                  className="w-full md:w-auto flex justify-center items-center gap-2 font-bold whitespace-nowrap px-6">
                  <MessageSquare size={18} /> Contactar
                </Button>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="text-zinc-300 mt-5 text-sm leading-relaxed border-t border-zinc-700/50 pt-5">
              {profile.bio}
            </p>
          )}
        </Card>

        {/* Sections */}
        <FreelancerSkillsSection skills={profile.skills ?? []} />

        {profile.experiences && profile.experiences.length > 0 && (
          <ExperiencesSection existing={profile.experiences} editable={false} />
        )}

        {profile.certifications && profile.certifications.length > 0 && (
          <CertificationsSection
            existing={profile.certifications}
            editable={false}
          />
        )}

        {profile.portfolioItems && profile.portfolioItems.length > 0 && (
          <PortfolioSection
            existing={profile.portfolioItems}
            editable={false}
          />
        )}

        <ReviewsList reviews={profile.reviews ?? []} />
      </div>
    </div>
  )
}
