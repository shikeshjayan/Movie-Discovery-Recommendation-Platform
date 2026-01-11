import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../context/ThemeProvider";

/**
 * Footer Component
 * Renders the site footer with:
 * - App name (Recommended Movie Database)
 * - Navigation links (Home, Movies, TV Shows, Dashboard)
 * - Copyright notice
 */
const Footer = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <footer>
      <div
        className={`flex flex-col items-center justify-center gap-2 p-2 shadow-lg border-t
          ${
            theme === "dark"
              ? "bg-[#312F2C] text-[#ECF0FF]"
              : "bg-[#ECF0FF] text-[#312F2C]"
          }
        `}
      >
        <h2>Recommended Movie Database</h2>

        {/* Footer Navigation */}
        <ul className="flex justify-between items-center gap-4">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/movies">Movies</NavLink>
          <NavLink to="/tvshows">TV Shows</NavLink>
          <span className="text-blue-950">|</span>
          <NavLink to="/dashboard/home">Dashboard</NavLink>
        </ul>

        <hr className="text-blue-950 w-full h-2" />

        {/* Copyright */}
        <div>© 2026 RMDB. All Rights Reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
