import {
  faAlarmClock,
  faHeart,
  faHouse,
  faStar,
} from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SignOutModal from "../../ui/SignOutModal";
import { useState } from "react";

const Topbar = () => {
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
      />

      {/* Topbar */}
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

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-white"
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ color: "red" }} />
        </button>
      </nav>
    </>
  );
};

export default Topbar;
