import { NavLink } from 'react-router-dom'
import SearchBox from '../features/search/SearchBox'
import { ThemeContext } from '../context/ThemeProvider'
import { useContext, useState } from 'react'
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CategoryWindow from './CategoryWindow'

const Header = () => {
  const { theme, themeToggle } = useContext(ThemeContext)
  const [isOpen, setIsOpen] = useState(true)

  const handleCategoryWindow = () => {
    setIsOpen(prev => !prev)
  }
  return (
    <header>
      {/* Desktop View */}
      <nav className={`fixed top-0 w-full h-20 flex justify-between items-center z-20 py-4 px-4 shadow-md ${theme === "dark"
        ? "bg-[#312F2C] text-[#FAFAFA]"
        : "bg-[#ECF0FF] text-[#312F2C]"
        }`}>
        <div className='text-3xl text-[#0064E0] animate-pulse'>RMDB</div>
        <ul className='flex gap-4 uppercase font-medium'>
          <NavLink to="/home" className={({ isActive }) =>
            isActive ? "text-[#171717]" : "hover:text-[#0064E0]"
          }>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) =>
            isActive ? "text-[#171717]" : "hover:text-[#0064E0]"
          }>Movies</NavLink>
          <NavLink to="/tvshows" className={({ isActive }) =>
            isActive ? "text-[#171717]" : "hover:text-[#0064E0]"
          }>Tv Shows</NavLink>
        </ul>
        <div>
          <SearchBox />
        </div>
        <button onClick={handleCategoryWindow} className='relative'>
          <img src="/public/grid.png" alt="" />
          <CategoryWindow isOpen={isOpen} />
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
      {/* Mobile View */}
      <nav className="hidden flex-col w-screen h-20 bg-red-200 px-4">
        <div className='flex justify-between items-center'>
          <span>Brand</span>
          <span>Menu</span>
        </div>
        <div className='w-screen fixed left-0 top-40 h-auto bg-blue-400'>
          <ul className='flex flex-col justify-around items-center'>
            <NavLink to="/home" className={({ isActive }) =>
              isActive ? "text-[#171717]" : "hover:text-[#1F6FEB]"
            }>Home</NavLink>
            <NavLink to="/movies" className={({ isActive }) =>
              isActive ? "text-[#171717]" : "hover:text-[#1F6FEB]"
            }>Movies</NavLink>
            <NavLink to="/tvshows" className={({ isActive }) =>
              isActive ? "text-[#171717]" : "hover:text-[#1F6FEB]"
            }>Tv Shows</NavLink>
          </ul>
          <div>
            <SearchBox />
          </div>
        </div>
      </nav>


    </header>
  )
}

export default Header