import { LogOut } from "lucide-react"
import { authClient } from "../../lib/authClient"
import Button from "../Button"

export default function LogoutBtn() {
  const signOut = async () => {
    const { error } = await authClient.signOut()

    if (!error) {
      window.location.reload()
    }
  }

  return (
    <Button onClick={signOut} btnType="danger" className="flex items-center gap-2">
      <LogOut size={16} />
      Salir
    </Button>
  )
}
