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
        ? "bg-[#252C37] text-[#ECF0FF]"
        : "bg-[#ECF0FF] text-[#252C37]"
        }`}>
        <Outlet />
      </main>
    </div>
  )
}

export default RootLayout