import { NavLink, useNavigate } from "react-router-dom";
import SearchBox from "../features/search/SearchBox";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext, useEffect, useState, useRef } from "react";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDropdown from "./ProfileDropdown";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
/**
 * Header Component
 * Renders the main navigation bar with:
 * - Logo (RMDB)
 * - Desktop navigation links (Home, Movies, TV Shows)
 * - SearchBox, theme toggle, and profile/login button
 * - Mobile menu (hamburger menu + overlay)
 */
const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, themeToggle } = useContext(ThemeContext);

  // State for dropdowns and mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Ref to detect clicks outside the profile dropdown
  const profileRef = useRef(null);

  /**
   * Close profile dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Prevent body scroll when mobile menu is open
   */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  return (
    <header>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.05, ease: "easeInOut" }}
        className={`fixed top-0 w-full h-20 flex justify-between items-center z-20 py-4 px-4 shadow-md transition-colors duration-300 ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }`}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
          whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
          className="text-3xl font-bold text-[#0073ff] cursor-pointer"
          onClick={() => navigate("/home")}
        >
          RMDB
        </motion.div>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex gap-6 uppercase font-medium">
          <motion.li
            initial={{ y: "-30px", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.3 }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              rotate: 1,
              transition: { duration: 0.1 },
            }}
          >
            <NavLink
              to="/home"
              className={({ isActive }) =>
                isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
              }
            >
              Home
            </NavLink>
          </motion.li>
          <motion.li
            initial={{ y: "-30px", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              rotate: 1,
              transition: { duration: 0.1 },
            }}
          >
            <NavLink
              to="/movies"
              className={({ isActive }) =>
                isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
              }
            >
              Movies
            </NavLink>
          </motion.li>
          <motion.li
            initial={{ y: "-30px", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            whileHover={{
              scale: 1.1,
              transition: { duration: 0.2 },
            }}
            whileTap={{
              scale: 0.95,
              rotate: 1,
              transition: { duration: 0.1 },
            }}
          >
            <NavLink
              to="/tvshows"
              className={({ isActive }) =>
                isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
              }
            >
              TV Shows
            </NavLink>
          </motion.li>
        </ul>

        {/* Right Side: Search, Theme Toggle, Profile/Login */}
        <div className="hidden md:flex items-center gap-6">
          <SearchBox />

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ rotate: 90 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 5, ease: "easeOut" }}
            onClick={themeToggle}
            className="text-xl"
          >
            <FontAwesomeIcon
              icon={theme === "dark" ? faSun : faMoon}
              color={theme === "dark" ? "#ffffff" : "#000"}
            />
          </motion.button>

          {/* Profile/Login Button + Dropdown */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeIn", delay: 1}}
            className="relative"
            ref={profileRef}
          >
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 font-medium rounded px-6 py-2 bg-[#0064E0] text-[#FAFAFA] hover:bg-[#0073ff] transition"
            >
              <span>{user ? "Profile" : "Login"}</span>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </motion.div>
        </div>

        {/* Mobile Menu Toggle Buttons */}
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
      </motion.nav>

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
              navigate(user ? "/dashboard" : "/signin");
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
