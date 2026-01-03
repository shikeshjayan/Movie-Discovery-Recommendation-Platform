import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import { ThemeContext } from "../context/ThemeProvider"
import { useContext } from "react"

const RootLayout = () => {
  const { theme } = useContext(ThemeContext)
  return (
    <div>
      <Header />
      <main className={`mt-20 max-w-screen min-h-screen ${theme === "dark"
        ? "bg-[#282A3D] text-[#ECF0FF]"
        : "bg-white text-black"
        }`}>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout