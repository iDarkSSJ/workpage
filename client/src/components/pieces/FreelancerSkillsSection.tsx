import Card from "../Card"
import { Sparkle } from "lucide-react"
import type { FreelancerSkillEntry } from "../../types/profiles"

export default function FreelancerSkillsSection({
  skills,
}: {
  skills: FreelancerSkillEntry[]
}) {
  if (!skills || skills.length === 0) return null

  return (
    <Card className="w-full">
      <h2 className="font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <Sparkle size={16} className="text-primary" />
        Habilidades
      </h2>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s.skillId}
            className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            {s.skill.name}
          </span>
        ))}
      </div>
    </Card>
  )
}
