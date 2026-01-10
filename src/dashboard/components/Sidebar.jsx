import {
  faAlarmClock,
  faHeart,
  faHouse,
  faStar,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
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
      <nav className="flex flex-col space-y-6 text-xl">
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

        <NavLink to="/dashboard" onClick={() => setOpen(false)}>
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
