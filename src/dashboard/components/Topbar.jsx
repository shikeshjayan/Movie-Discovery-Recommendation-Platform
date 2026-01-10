import { faAlarmClock, faHeart, faHouse, faStar } from "@fortawesome/free-regular-svg-icons";
import { faClockRotateLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";

const Topbar = () => {
  return (
    <nav className="flex md:hidden bg-gray-700 p-4 justify-around">
      <NavLink to="/dashboard/home" className="text-white">
        <FontAwesomeIcon icon={faHouse} />
      </NavLink>
      <NavLink to="/dashboard/wishlist" className="text-white">
        <FontAwesomeIcon icon={faHeart} />
      </NavLink>
      <NavLink to="/dashboard/history" className="text-white">
        <FontAwesomeIcon icon={faClockRotateLeft} />
      </NavLink>
      <NavLink to="/dashboard/myreviews" className="text-white">
        <FontAwesomeIcon icon={faStar} />
      </NavLink>
      <NavLink to="/dashboard/watchlater" className="text-white">
        <FontAwesomeIcon icon={faAlarmClock} />
      </NavLink>
    </nav>
  );
};

export default Topbar;
