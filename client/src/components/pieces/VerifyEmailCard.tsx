import { useState } from "react"
import Button from "../Button"
import Card from "../Card"
import { showToast } from "../showToast"
import { verifyEmailReq } from "../../lib/authRequest"

export default function VerifyEmailCard() {
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    setLoading(true)
    try {
      const { success, error } = await verifyEmailReq()

      if (!success) {
        showToast("error", error)
        return
      }

      showToast("success", "Verifica tu bandeja de entrada.", {
        duration: 12000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md w-full text-center space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-white">
          Verifica tu correo electrónico
        </h2>

        <p className="text-sm text-zinc-400">
          Necesitas verificar tu correo para poder acceder a la plataforma.
        </p>
      </div>

      <div className="flex justify-center">
        <Button btnType="primary" onClick={handleSend} disabled={loading}>
          {loading ? "Enviando..." : "Enviar correo de verificación"}
        </Button>
      </div>
    </Card>
  )
}
