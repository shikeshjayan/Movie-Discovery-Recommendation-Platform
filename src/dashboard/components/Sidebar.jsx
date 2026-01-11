import {
  faAlarmClock,
  faHeart,
  faHouse,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeProvider";
import { useContext } from "react";
const Sidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full md:h-auto md:w-25 p-6 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      } ${
        theme === "dark"
          ? "bg-blue-950 text-blue-100"
          : "bg-blue-100 text-blue-950"
      }`}
    >
      <nav className="flex flex-col space-y-6 text-xl">
        <NavLink to="/dashboard" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
        <NavLink to="/dashboard/home" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faUser} />
        </NavLink>

        <NavLink to="/dashboard/wishlist" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faHeart} />
        </NavLink>

        <NavLink to="/dashboard/history" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faClockRotateLeft} />
        </NavLink>

        <NavLink to="/dashboard/myreviews" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faStar} />
        </NavLink>

        <NavLink to="/dashboard/watchlater" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faAlarmClock} />
        </NavLink>

        <button onClick={() => navigate("/home")}>
          <img
            src={
              theme === "dark"
                ? "/exit_to_app_white.svg"
                : "/exit_to_app_black.svg"
            }
            alt="Exit"
          />
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
