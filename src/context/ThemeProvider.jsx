import { Children, createContext, useState } from "react"

export const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState("dark")

    const themeToggle = () => {
        setTheme(prevTheme => prevTheme === "dark" ? "light" : "dark")
    }

    return (
        <ThemeContext.Provider value={{ theme, themeToggle }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeProvider