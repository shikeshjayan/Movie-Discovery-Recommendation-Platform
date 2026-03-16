import {
  faAlarmClock,
  faHeart,
  faHouse,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowUp,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeProvider";
import SignOutModal from "../../ui/SignOutModal";
import { motion } from "framer-motion";

/**
 * Topbar
 * --------------------------------------------------
 * Mobile-only dashboard navigation bar.
 * Includes:
 * - Active route styling
 * - Framer Motion icon animations
 * - Sign-out confirmation modal
 */
const Topbar = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Controls visibility of sign-out confirmation modal
  const [showConfirm, setShowConfirm] = useState(false);

  /**
   * Shared Framer Motion animation for icons
   */
  const iconMotion = {
    whileHover: { scale: 1.15 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 300 },
  };

  /**
   * NavLink styling with active state support
   */
  const navLinkClass = ({ isActive }) =>
    `
      p-2 rounded-lg transition-colors duration-200
      ${
        isActive
          ? theme === "dark"
            ? "bg-blue-800 text-white"
            : "bg-blue-300 text-blue-950"
          : "opacity-80 hover:opacity-100"
      }
    `;

  return (
    <>
      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
      />

      {/* Mobile Top Navigation */}
      <nav
        className={`flex md:hidden p-4 justify-around ${
          theme === "dark"
            ? "bg-blue-950 text-blue-100"
            : "bg-blue-100 text-blue-950"
        }`}
      >
        <NavLink to="/dashboard/home" className={navLinkClass}>
          <motion.div {...iconMotion}>
            <FontAwesomeIcon icon={faHouse} />
          </motion.div>
        </NavLink>

        <NavLink to="/dashboard/wishlist" className={navLinkClass}>
          <motion.div {...iconMotion}>
            <FontAwesomeIcon icon={faHeart} />
          </motion.div>
        </NavLink>

        <NavLink to="/dashboard/history" className={navLinkClass}>
          <motion.div {...iconMotion}>
            <FontAwesomeIcon icon={faClockRotateLeft} />
          </motion.div>
        </NavLink>

        <NavLink to="/dashboard/myreviews" className={navLinkClass}>
          <motion.div {...iconMotion}>
            <FontAwesomeIcon icon={faStar} />
          </motion.div>
        </NavLink>

        <NavLink to="/dashboard/watchlater" className={navLinkClass}>
          <motion.div {...iconMotion}>
            <FontAwesomeIcon icon={faAlarmClock} />
          </motion.div>
        </NavLink>

        {/* Exit Dashboard (Navigate to Home) */}
        <motion.button
          {...iconMotion}
          aria-label="Exit Dashboard"
          onClick={() => navigate("/home")}
          className="p-2 rounded-lg"
        >
          <img
            src={
              theme === "dark"
                ? "/exit_to_app_white.svg"
                : "/exit_to_app_black.svg"
            }
            alt="Exit"
          />
        </motion.button>

        {/* Sign Out Button */}
        <motion.button
          {...iconMotion}
          aria-label="Sign Out"
          onClick={() => setShowConfirm(true)}
          className="p-2 rounded-lg"
        >
          <FontAwesomeIcon icon={faArrowUp} className="text-red-500" />
        </motion.button>
      </nav>
    </>
  );
};

export default Topbar;
