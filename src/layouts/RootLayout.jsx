import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

const RootLayout = () => {
  return (
    <div>
      <Header />
      <main className="mt-20 max-w-screen min-h-screen bg-neutral-100">
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout