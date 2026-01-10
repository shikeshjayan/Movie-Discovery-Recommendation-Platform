import { faAlarmClock, faHeart, faHouse, faStar } from "@fortawesome/free-regular-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const Sidebar = ({ open, setOpen }) => {
  return (
    <aside
      className={`fixed md:static top-0 left-0 h-full md:h-auto md:w-25 bg-gray-700 p-6 transform transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/dashboard/home"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white ${
              isActive ? "font-semibold text-white" : ""
            }`
          }
          onClick={() => setOpen(false)} // close sidebar on link click
        >
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
        <NavLink
          to="/dashboard/wishlist"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white ${
              isActive ? "font-semibold text-white" : ""
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon icon={faHeart} />
        </NavLink>
        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white ${
              isActive ? "font-semibold text-white" : ""
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon icon={faClockRotateLeft} />
        </NavLink>
        <NavLink
          to="/dashboard/myreviews"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white ${
              isActive ? "font-semibold text-white" : ""
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon icon={faStar} />
        </NavLink>
        <NavLink
          to="/dashboard/watchlater"
          className={({ isActive }) =>
            `text-gray-300 hover:text-white ${
              isActive ? "font-semibold text-white" : ""
            }`
          }
          onClick={() => setOpen(false)}
        >
          <FontAwesomeIcon icon={faAlarmClock} />
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
