import { NavLink } from 'react-router-dom'
import SearchBox from '../features/search/SearchBox'
import { ThemeContext } from '../context/ThemeProvider'
import { useContext } from 'react'
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = () => {
  const { theme, themeToggle } = useContext(ThemeContext)
  return (
    <header>
      <nav className={`fixed top-0 w-full h-20 flex justify-between items-center bg-transparent backdrop-blur-md z-20 py-4 shadow-md ${theme === "dark"
        ? "bg-[#282A3D] text-[#ECF0FF]"
        : "bg-white text-black"
        }`}>
        <div className='text-3xl text-blue-500 animate-pulse'>RMDB</div>
        <ul className='flex gap-4 uppercase font-medium'>
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/tvshows">Tv Shows</NavLink>
        </ul>
        <div>
          <SearchBox />
        </div>
        <button className='relative'>
          <img src="/public/grid.png" alt="" />
          {/* Category */}
        </button>
        <div className='flex gap-8'>
          <button onClick={themeToggle}>
            {theme === "dark" ? <FontAwesomeIcon icon={faSun} style={{ color: "#ffff00", }} /> :
              <FontAwesomeIcon icon={faMoon} style={{ color: "#000000", }} />}
          </button>
          <button>
            Profile
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header