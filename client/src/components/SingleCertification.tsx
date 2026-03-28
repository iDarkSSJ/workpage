import { Pencil, Trash2 } from "lucide-react"
import type { FreelancerCertification } from "../types/profiles"
import Button from "./Button"
import Card from "./Card"
import Link from "./Link"
import { useLoading } from "../context/LoadingContext"
import { deleteFreelancerCertification } from "../lib/profilesApi"
import { showToast } from "./showToast"

interface SingleCertificationProps {
  cert: FreelancerCertification
  editable?: boolean
  onDeleted?: (id: string) => void
  onEdit?: (cert: FreelancerCertification) => void
}

export default function SingleCertification({
  cert,
  editable = false,
  onDeleted,
  onEdit,
}: SingleCertificationProps) {
  const { isLoading, setLoading } = useLoading()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const result = await deleteFreelancerCertification(cert.id)
      if (!result.success) {
        showToast("error", result.error)
        return
      }
      showToast("success", "Certificación eliminada")
      onDeleted?.(cert.id)
    } catch (err) {
      showToast(
        "error",
        err instanceof Error ? err.message : "Error inesperado",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-none bg-primary-bg/50 flex justify-between">
      <div>
        <p className="text-md font-semibold text-zinc-100">{cert.name}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{cert.institution}</p>
        {cert.issuedDate && (
          <p className="text-xs text-zinc-500 mt-1">{cert.issuedDate}</p>
        )}
        {cert.url && (
          <Link
            isExternal
            path={cert.url}
            className="text-xs text-blue-400 hover:underline mt-2 block break-all">
            {cert.url}
          </Link>
        )}
      </div>

      {editable && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            btnType="default"
            disabled={isLoading}
            onClick={() => onEdit?.(cert)}>
            <Pencil size={20} />
          </Button>
          <Button
            type="button"
            btnType="danger"
            disabled={isLoading}
            onClick={handleDelete}>
            <Trash2 size={20} />
          </Button>
        </div>
      )}
    </Card>
  )
}
