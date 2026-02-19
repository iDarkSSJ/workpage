import { authClient } from "../../lib/authClient"
import Button from "../Button"

export default function LogoutBtn() {
  const signOut = async () => {
    const { data, error } = await authClient.signOut()

    if (error) {
      console.log(error)
    } else {
      console.log(data)
    }
  }

  return (
    <Button onClick={signOut} btnType="danger">
      Cerrar Sesión
    </Button>
  )
}
