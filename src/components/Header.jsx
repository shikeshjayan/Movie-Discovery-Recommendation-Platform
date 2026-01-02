import React from 'react'
import { NavLink } from 'react-router-dom'
import SearchBox from '../features/search/SearchBox'

const Header = () => {
  return (
    <header>
      <nav className='fixed top-0 w-full h-20 flex justify-between items-center bg-transparent backdrop-blur-md z-20 px-4 py-4 shadow-md'>
        <div className='text-3xl text-blue-500 animate-pulse'>RMDB</div>
        <ul className='flex gap-4 uppercase font-medium'>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/tvshows">Tv Shows</NavLink>
        </ul>
        <div>
          <SearchBox />
        </div>
        <button>
          Category
        </button>
        <div className='flex gap-8'>
          <button>
            TT
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