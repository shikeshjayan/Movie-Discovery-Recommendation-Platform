import { NavLink, useNavigate } from "react-router-dom";
import SearchBox from "../features/search/SearchBox";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext, useEffect, useState, useRef } from "react"; // Added useRef
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDropdown from "./ProfileDropdown";
import {
  faBars,
  faXmark,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, themeToggle } = useContext(ThemeContext);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 2. REF: To detect outside clicks
  const profileRef = useRef(null);

  // 3. CLICK OUTSIDE LOGIC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Block scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  return (
    <header>
      {/* Desktop View */}
      <nav
        className={`fixed top-0 w-full h-20 flex justify-between items-center z-20 py-4 px-4 shadow-md transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }`}
      >
        <div className="text-3xl font-bold text-[#0073ff] animate-pulse cursor-pointer">
          RMDB
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 uppercase font-medium">
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
            TV Shows
          </NavLink>
        </ul>

        {/* Search & Actions */}
        <div className="hidden md:flex items-center gap-6">
          <SearchBox />

          <button onClick={themeToggle} className="text-xl">
            <FontAwesomeIcon
              icon={theme === "dark" ? faSun : faMoon}
              color={theme === "dark" ? "#ffff00" : "#000"}
            />
          </button>

          {/* --- PROFILE DROPDOWN SECTION --- */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 font-medium rounded px-6 py-2 bg-[#0073ff] text-white hover:text-[#0073ff] hover:bg-white transition"
            >
              <span>{user ? "Profile" : "Login"}</span>
            </button>

            {/* The Dropdown Component */}
            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
          {/* ------------------------------- */}
        </div>

        {/* Mobile Toggle Button (Visible only on mobile) */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={themeToggle}>
            <FontAwesomeIcon icon={theme === "dark" ? faSun : faMoon} />
          </button>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              size="xl"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-20 left-0 w-full ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        } p-6 transform transition-transform duration-300 z-50 ${
          isMobileMenuOpen ? "translate-y-0" : "-translate-y-[200%]"
        }`}
      >
        <div className="flex flex-col items-center gap-6">
          <NavLink to="/home" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/movies" onClick={() => setIsMobileMenuOpen(false)}>
            Movies
          </NavLink>
          <NavLink to="/tvshows" onClick={() => setIsMobileMenuOpen(false)}>
            TV Shows
          </NavLink>
          <SearchBox />
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              navigate(user ? "/profile" : "/signin");
            }}
          >
            {user ? "Profile" : "Login"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
