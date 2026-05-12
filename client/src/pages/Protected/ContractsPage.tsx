import { useSearchParams } from "react-router"
import { useMyContracts } from "../../features/contracts/api/useContracts"
import ContractCard from "../../features/contracts/components/ContractCard"
import { BriefcaseBusiness, User as UserIcon, AlertCircle } from "lucide-react"
import TabSelector from "../../components/ui/TabSelector"

type Tab = "contractor" | "freelancer"

export default function ContractsPage() {
  const { data, error } = useMyContracts()
  const [searchParams, setSearchParams] = useSearchParams()

  const activeTab = (searchParams.get("tab") as Tab) || "freelancer"

  const setActiveTab = (newTab: Tab) => {
    setSearchParams({ tab: newTab })
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-red-500 mb-4 opacity-20" />
        <h2 className="text-xl font-bold text-zinc-100 mb-2">
          Error al cargar contratos
        </h2>
        <p className="text-zinc-500">
          Inténtalo de nuevo más tarde o contacta a soporte.
        </p>
      </div>
    )
  }

  const contracts =
    activeTab === "freelancer" ? data?.asFreelancer : data?.asContractor

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <BriefcaseBusiness className="text-primary" size={32} />
          Gestión de Contratos
        </h1>
        <p className="text-zinc-500 mt-2">
          Administra tus proyectos en curso y finalizados.
        </p>
      </div>

      {/* Tabs */}
      <TabSelector
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as Tab)}
        className="mb-8"
        tabs={[
          {
            id: "freelancer",
            label: "Como Freelancer",
            icon: <UserIcon size={18} />,
            badge: data?.asFreelancer.length || undefined,
          },
          {
            id: "contractor",
            label: "Como Contratante",
            icon: <BriefcaseBusiness size={18} />,
            badge: data?.asContractor.length || undefined,
          },
        ]}
      />

      {/* Si no tiene contratos entonces mostrar esto */}
      {!contracts || contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mb-6">
            <BriefcaseBusiness className="text-zinc-600" size={32} />
          </div>
          <h3 className="text-xl font-bold text-zinc-200 mb-2">
            No tienes contratos todavía
          </h3>
          <p className="text-zinc-500 max-w-sm">
            {activeTab === "freelancer"
              ? "Cuando un contratante acepte tu propuesta, verás el contrato aquí para empezar a trabajar."
              : "Cuando aceptes una propuesta de un freelancer, el contrato aparecerá aquí para que lo gestiones."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {contracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              role={activeTab}
            />
          ))}
        </div>
      )}
    </div>
  )
}
