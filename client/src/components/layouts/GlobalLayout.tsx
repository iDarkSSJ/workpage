import { Outlet } from "react-router"
import { useAuth } from "../../context/AuthContext"
import Navbar from "../Navbar"

// Esta es la estructura base de la aplicacion
// Mas que todo para que se muestre la navbar solo si el usuario esta logueado
// Y que el contenido de la pagina se muestre debajo de la navbar
export default function GlobalLayout() {
  const { data: session } = useAuth()

  return (
    <>
      {session && <Navbar />}
      <div className={session ? "pt-16" : ""}>
        <Outlet />
      </div>
    </>
  )
}
