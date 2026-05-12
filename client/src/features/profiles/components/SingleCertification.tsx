import { Pencil, Trash2 } from "lucide-react"
import type { Certification as FreelancerCertification } from "../types/profiles.types"
import Button from "../../../components/Button"
import Card from "../../../components/Card"
import Link from "../../../components/Link"

import { useDeleteCertification } from "../api/useCertifications.api"
import { formatDate } from "../../../utils/formatDate"

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
  const { mutate: deleteCert, isPending } = useDeleteCertification()

  const handleDelete = () => {
    deleteCert(cert.id, {
      onSuccess: () => onDeleted?.(cert.id),
    })
  }

  return (
    <Card className="w-full shadow-none bg-primary-bg/50 flex justify-between flex-wrap sm:flex-nowrap">
      <div className="w-full">
        <p className="text-md font-semibold text-zinc-100">{cert.name}</p>
        <p className="text-sm text-zinc-300 mt-0.5">{cert.institution}</p>
        {cert.issuedDate && (
          <p className="text-sm text-zinc-500 mt-1">
            {formatDate(cert.issuedDate)}
          </p>
        )}
        {cert.url && (
          <Link
            isExternal
            path={cert.url}
            className="text-sm text-blue-400 hover:underline mt-2 block break-all">
            {cert.url}
          </Link>
        )}
      </div>

      {editable && (
        <div className="flex items-center gap-2 ml-auto">
          <Button
            type="button"
            btnType="default"
            disabled={isPending}
            onClick={() => onEdit?.(cert)}>
            <Pencil size={20} />
          </Button>
          <Button
            type="button"
            btnType="danger"
            disabled={isPending}
            onClick={handleDelete}>
            <Trash2 size={20} />
          </Button>
        </div>
      )}
    </Card>
  )
}
