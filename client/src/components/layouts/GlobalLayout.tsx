import { Outlet } from "react-router"
import Navbar from "../Navbar"

export default function GlobalLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
    </div>
  )
}
