import { NavLink } from "react-router-dom";
import SearchBox from "../features/search/SearchBox";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext, useEffect, useState } from "react";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryWindow from "./CategoryWindow";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const { theme, themeToggle } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const handleCategoryWindow = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <header>
      {/* Desktop View */}
      <nav
        className={`fixed top-0 w-full h-20 flex justify-between items-center z-20 py-4 px-4 shadow-md ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }`}
      >
        <div className="text-3xl text-[#0073ff] animate-pulse">RMDB</div>
        <ul className="flex gap-4 uppercase font-medium">
          <NavLink
            to="/home"
            className={({ isActive }) =>
              isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) =>
              isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
            }
          >
            Movies
          </NavLink>
          <NavLink
            to="/tvshows"
            className={({ isActive }) =>
              isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
            }
          >
            Tv Shows
          </NavLink>
        </ul>
        <div>
          <SearchBox />
        </div>
        <button onClick={handleCategoryWindow} className="relative">
          <img src="/public/grid.png" alt="" />
          <CategoryWindow isOpen={isOpen} />
        </button>
        <div className="flex gap-8">
          <button onClick={themeToggle}>
            {theme === "dark" ? (
              <FontAwesomeIcon icon={faSun} style={{ color: "#ffff00" }} />
            ) : (
              <FontAwesomeIcon icon={faMoon} style={{ color: "#000000" }} />
            )}
          </button>
          <button>Profile</button>
        </div>
      </nav>
      {/* Mobile View */}
      <>
        {/* Blur overlay – covers EVERYTHING */}
        {open && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setOpen((prev) => !prev)}
          />
        )}

        {/* Nav */}
        <nav
          className={`fixed md:hidden top-0 left-0 w-full h-20 px-4 z-50 ${
            theme === "dark"
              ? "bg-[#312F2C] text-[#FAFAFA]"
              : "bg-[#ECF0FF] text-[#312F2C]"
          }`}
        >
          <div className="flex justify-between items-center h-full">
            <span>RMDB</span>
            <div className="flex gap-8">
              <button onClick={themeToggle}>
                {theme === "dark" ? (
                  <FontAwesomeIcon icon={faSun} style={{ color: "#ffff00" }} />
                ) : (
                  <FontAwesomeIcon icon={faMoon} style={{ color: "#000000" }} />
                )}
              </button>
            </div>

            <span
              onClick={() => setOpen((prev) => !prev)}
              className="cursor-pointer transition-all duration-300 ease-in-out hover:scale-125 hover:rotate-90"
            >
              {open === true ? (
                <FontAwesomeIcon icon={faXmark} size="xl" color="#e00000" />
              ) : (
                <FontAwesomeIcon icon={faBars} size="xl" color="#0064E0" />
              )}
            </span>
          </div>
        </nav>

        {/* Menu panel */}
        {open && (
          <div className="container fixed top-20 left-0 w-full flex flex-col items-center gap-4 z-50 text-white">
            <ul className="flex flex-col items-center justify-center gap-6 py-6">
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/movies">Movies</NavLink>
              <NavLink to="/tvshows">TV Shows</NavLink>
            </ul>
            <div className="w-full max-w-md flex justify-center">
              <SearchBox />
            </div>
            <ul>
              <button>Profile</button>
            </ul>
          </div>
        )}
      </>
    </header>
  );
};

export default Header;
