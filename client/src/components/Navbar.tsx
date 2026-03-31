import { useState } from "react"
import { useNavigate } from "react-router"
import {
  Menu,
  X,
  BriefcaseBusiness,
  User,
  LayoutDashboard,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"
import Link from "./Link"
import LogoutBtn from "./pieces/LogoutBtn"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useAuth()
  const navigate = useNavigate()

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Proyectos",
      path: "/projects",
      icon: <BriefcaseBusiness size={18} />,
    },
    {
      name: "Mis Contratos",
      path: "/dashboard/contracts",
      icon: <BriefcaseBusiness size={18} />,
    },
    {
      name: "Perfil",
      path: "/dashboard/edit-profile",
      icon: <User size={18} />,
    },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 bg-secondary-bg/95 backdrop-blur-sm border-b border-zinc-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LOGO AREA */}
          <div
            className="shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/dashboard")}>
            <BriefcaseBusiness className="text-primary" size={28} />
            <span className="text-xl font-bold text-zinc-100 hidden sm:block">
              Workpage
            </span>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  path={link.path}
                  className="text-zinc-300 hover:text-primary transition-colors flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm">
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* DESKTOP USER ACTIONS */}
          <div className="hidden lg:flex items-center gap-4">
            {session?.user?.role !== "freelancer" && (
              <Button
                btnType="secondary"
                className="text-sm px-4 py-1.5"
                onClick={() => navigate("/projects/new")}>
                + Crear Proyecto
              </Button>
            )}
            <div className="text-sm text-zinc-400">
              {session?.user?.name || session?.user?.email}
            </div>
            <LogoutBtn />
          </div>

          {/* MOBILE BURGER MENU BUTTON */}
          <div className="-mr-2 flex lg:hidden">
            <Button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700">
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="lg:hidden bg-secondary-bg border-b border-zinc-700/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                btnType="default"
                onClick={() => {
                  navigate(link.path)
                  setIsOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 hover:bg-zinc-800/50 hover:text-primary text-zinc-300">
                {link.icon}
                {link.name}
              </Button>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-zinc-700/50">
            <div className="flex items-center px-5 mb-4">
              <div className="ml-3">
                <div className="text-base font-medium leading-none text-white">
                  {session?.user?.name}
                </div>
                <div className="text-sm font-medium leading-none text-zinc-400 mt-1">
                  {session?.user?.email}
                </div>
              </div>
            </div>
            <div className="px-5 space-y-2">
              {session?.user?.role !== "freelancer" && (
                <Button
                  btnType="secondary"
                  onClick={() => {
                    navigate("/projects/new")
                    setIsOpen(false)
                  }}
                  className="w-full text-center px-4 py-2 rounded-md font-semibold transition-colors">
                  + Crear Proyecto
                </Button>
              )}
              <LogoutBtn />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
