import { NavLink, useNavigate, useLocation } from "react-router-dom";
import SearchBox from "../features/search/SearchBox";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext, useEffect, useState, useRef } from "react";
import { faMoon, faSun } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileDropdown from "./ProfileDropdown";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import SignOutModal from "../ui/SignOutModal";

/**
 * Helper to conditionally join class names.
 * Avoids repetitive ternary chains for theme-based classes.
 */
const cn = (...classes) => classes.filter(Boolean).join(" ");

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/movies", label: "Movies" },
  { to: "/tvshows", label: "TV Shows" },
  { to: "/Recommendations", label: "For You" },
];

// Framer Motion variants
const navVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
};

const logoVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.2 },
  },
};

const navListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
};

const rightSideVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: "easeIn", delay: 0.6 },
  },
};

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } },
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: "easeOut" } },
};

/**
 * Header Component
 * Renders the main navigation bar with:
 * - Logo (RMDB)
 * - Desktop navigation links (Home, Movies, TV Shows)
 * - SearchBox, theme toggle, and profile/login button
 * - Mobile menu (hamburger menu + overlay)
 */
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, themeToggle } = useContext(ThemeContext);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);

  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isDark = theme === "dark";

  return (
    <header>
      {/* 2. PLACE THE MODAL HERE (Outside the nav tags) */}
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
      />
      {/* Desktop Navigation */}
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "fixed top-0 w-full h-16 sm:h-20 flex justify-between items-center z-20 py-3 px-4 sm:px-6 lg:px-10 shadow-md transition-colors duration-300",
          isDark
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]",
        )}>
        {/* Logo */}
        <motion.div
          variants={logoVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.05, filter: "brightness(1.2)" }}
          className="text-2xl sm:text-3xl font-bold text-[#0073ff] cursor-pointer"
          onClick={() => navigate("/home")}>
          ▶
        </motion.div>

        {/* Desktop Navigation Links — staggered via parent variants */}
        <motion.ul
          variants={navListVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex gap-6 uppercase font-medium text-sm tracking-wide">
          {NAV_LINKS.map(({ to, label }) => (
            <motion.li
              key={to}
              variants={navItemVariants}
              whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              whileTap={{
                scale: 0.95,
                rotate: 1,
                transition: { duration: 0.1 },
              }}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? "text-[#0064E0]" : "hover:text-[#0073ff]"
                }>
                {label}
              </NavLink>
            </motion.li>
          ))}
        </motion.ul>

        {/* Right Side: Search, Theme Toggle, Profile/Login */}
        <motion.div
          variants={rightSideVariants}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex items-center gap-4 xl:gap-6">
          <SearchBox />

          {/* Theme Toggle */}
          <motion.button
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.2 }}
            onClick={themeToggle}
            className="text-xl focus:outline-none focus:ring-2 focus:ring-blue-500 rounded">
            <FontAwesomeIcon
              icon={isDark ? faSun : faMoon}
              className={isDark ? "text-[#FAFAFA]" : "text-[#312F2C]"}
            />
          </motion.button>

          {/* Profile/Login Button + Dropdown
              Desktop: opens ProfileDropdown
              Mobile: navigates to /dashboard or /login */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 font-medium rounded px-4 xl:px-6 py-2 text-sm bg-[#0064E0] text-[#FAFAFA] hover:bg-[#0073ff] transition">
              <span>{user ? "Profile" : "Login"}</span>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
            />
          </div>
        </motion.div>

        {/* Mobile/Tablet Menu Toggle — visible below lg */}
        <div className="lg:hidden flex items-center gap-3 sm:gap-4">
          <button
            onClick={themeToggle}
            className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
            aria-label="Toggle theme">
            <FontAwesomeIcon icon={isDark ? faSun : faMoon} size="lg" />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition"
            aria-label="Toggle menu">
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              size="xl"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile/Tablet Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              "fixed top-16 sm:top-20 left-0 w-full h-[calc(100dvh-4rem)] sm:h-[calc(100dvh-5rem)]",
              "flex flex-col p-6 sm:p-8 gap-1 z-50 shadow-xl overflow-y-auto",
              isDark
                ? "bg-[#312F2C] text-[#FAFAFA]"
                : "bg-[#ECF0FF] text-[#312F2C]",
            )}>
            {/* Nav Links */}
            <nav className="flex flex-col gap-1 mb-6">
              {NAV_LINKS.map(({ to, label }) => (
                <motion.div key={to} variants={mobileItemVariants}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      cn(
                        "block w-full px-4 py-3 rounded-lg text-lg font-medium transition-colors",
                        isActive
                          ? "text-[#0064E0] bg-[#0064E0]/10"
                          : isDark
                            ? "hover:bg-white/10"
                            : "hover:bg-black/5",
                      )
                    }>
                    {label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Divider */}
            <motion.hr
              variants={mobileItemVariants}
              className={cn(
                "mb-6",
                isDark ? "border-white/10" : "border-black/10",
              )}
            />

            {/* Search — wrapper forces full width on SearchBox and its inner input */}
            <motion.div
              variants={mobileItemVariants}
              className="w-full mb-4 *:w-full [&_input]:w-full [&_form]:w-full">
              <SearchBox />
            </motion.div>

            {/* Profile / Login */}
            <motion.div variants={mobileItemVariants}>
              <button
                onClick={() => navigate(user ? "/dashboard" : "/login")}
                className="w-full font-medium rounded-lg px-6 py-3 bg-[#0064E0] text-[#FAFAFA] hover:bg-[#0073ff] transition text-base">
                {user ? "Profile" : "Login"}
              </button>
            </motion.div>

            {/* ADDED: Logout Button (Only visible if user is logged in) */}
            {user && (
              <button
                onClick={() => {
                  // First, show the modal
                  setIsSignOutModalOpen(true);
                  // Then, close the mobile menu so it doesn't block the modal
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg font-bold">
                Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
