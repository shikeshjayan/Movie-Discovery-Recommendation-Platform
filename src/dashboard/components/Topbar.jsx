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
import { useAuth } from "../../context/AuthContext";
import SignOutModal from "../../ui/SignOutModal";
import { useContext, useState } from "react";
import { ThemeContext } from "../../context/ThemeProvider";

const Topbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
      />

      {/* Topbar */}
      <nav
        className={`flex md:hidden p-4 justify-around ${
          theme === "dark"
            ? "bg-blue-950 text-blue-100"
            : "bg-blue-100 text-blue-950"
        }`}
      >
        <NavLink to="/dashboard/home">
          <FontAwesomeIcon icon={faHouse} />
        </NavLink>
        <NavLink to="/dashboard/wishlist">
          <FontAwesomeIcon icon={faHeart} />
        </NavLink>
        <NavLink to="/dashboard/history">
          <FontAwesomeIcon icon={faClockRotateLeft} />
        </NavLink>
        <NavLink to="/dashboard/myreviews">
          <FontAwesomeIcon icon={faStar} />
        </NavLink>
        <NavLink to="/dashboard/watchlater">
          <FontAwesomeIcon icon={faAlarmClock} />
        </NavLink>
        <button onClick={() => navigate("/home")}>
          <img src="/exit_to_app.svg" alt="" />
        </button>
        {/* Sign Out Button */}
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-white"
        >
          <FontAwesomeIcon icon={faArrowUp} style={{ color: "red" }} />
        </button>
      </nav>
    </>
  );
};

export default Topbar;
