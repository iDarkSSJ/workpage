import { useEffect, useState } from "react"
import { getMyContracts, completeContract } from "../../lib/contractsApi"
import type { MyContracts, Contract } from "../../types/projects"
import { useLoading } from "../../context/LoadingContext"
import { showToast } from "../../components/showToast"
import Card from "../../components/Card"
import Button from "../../components/Button"
import { Briefcase, Building2 } from "lucide-react"
import { cn } from "../../utils/cn"
import ContractCard from "../../components/pieces/ContractCard"

export default function MyContractsPage() {
  const [contracts, setContracts] = useState<MyContracts | null>(null)
  const [tab, setTab] = useState<"freelancer" | "contractor">("freelancer")
  const { isLoading, setLoading } = useLoading()

  const loadContracts = async () => {
    setLoading(true)
    try {
      const result = await getMyContracts()
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      const data = result.data
      setContracts(data)
      if (data.asContractor.length > 0 && data.asFreelancer.length === 0)
        setTab("contractor")
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContracts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleComplete = async (id: string) => {
    setLoading(true)
    try {
      const result = await completeContract(id)
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      showToast("success", "Contrato completado con éxito")
      loadContracts()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado"
      showToast("error", message)
    } finally {
      setLoading(false)
    }
  }

  if (!contracts) return null

  const activeContracts =
    tab === "freelancer" ? contracts.asFreelancer : contracts.asContractor

  return (
    <main className="min-h-dvh bg-primary-bg py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-zinc-100">Mis Contratos</h1>

        {/* pestañas */}
        <div className="flex gap-2 border-b border-zinc-800 pb-4">
          <Button
            type="button"
            onClick={() => setTab("freelancer")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
              tab === "freelancer"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 bg-transparent",
            )}>
            <Briefcase size={16} /> Como Freelancer (
            {contracts.asFreelancer.length})
          </Button>

          <Button
            type="button"
            onClick={() => setTab("contractor")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer",
              tab === "contractor"
                ? "bg-primary text-white"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 bg-transparent",
            )}>
            <Building2 size={16} /> Como Contratante (
            {contracts.asContractor.length})
          </Button>
        </div>

        <div className="space-y-4">
          {activeContracts.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-zinc-400">
                No tienes contratos actuales como {tab}.
              </p>
            </Card>
          ) : (
            activeContracts.map((c: Contract) => (
              <ContractCard
                key={c.id}
                contract={c}
                tab={tab}
                isLoading={isLoading}
                onComplete={handleComplete}
              />
            ))
          )}
        </div>
      </div>
    </main>
  )
}
