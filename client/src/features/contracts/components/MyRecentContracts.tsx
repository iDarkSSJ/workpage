import { useMyContracts } from "../api/useContracts"
import ContractCard from "./ContractCard"
import Card from "../../../components/Card"
import Link from "../../../components/Link"
import { BriefcaseBusiness } from "lucide-react"

export default function MyRecentContracts() {
  const { data } = useMyContracts()

  const allContracts = [
    ...(data?.asFreelancer || []),
    ...(data?.asContractor || []),
  ]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, 2)

  if (allContracts.length === 0) return null

  return (
    <Card className="bg-secondary-bg/50 border-zinc-800/50">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-2">
            <BriefcaseBusiness className="text-primary" size={20} />
            Contratos Recientes
          </h2>
          <Link
            path="/dashboard/contracts"
            className="text-primary text-sm font-bold hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {allContracts.map((contract) => {
            const role = data?.asFreelancer.find((c) => c.id === contract.id)
              ? "freelancer"
              : "contractor"
            return (
              <ContractCard key={contract.id} contract={contract} role={role} />
            )
          })}
        </div>
      </div>
    </Card>
  )
}
