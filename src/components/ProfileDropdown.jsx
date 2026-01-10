import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SignOutModal from "../ui/SignOutModal";
import { useState } from "react";

const ProfileDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  if (!isOpen) return null;

  return (
    <>
      {/* Sign Out Confirmation Modal */}
      <SignOutModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
      />

      <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg py-2 z-50 border border-gray-100 font-sans text-sm">
        {/* Show Profile/Settings ONLY if logged in */}
        {user && (
          <>
            <div
              onClick={() => {
                navigate("/dashboard");
                onClose();
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              My Space
            </div>
            <div
              onClick={() => {
                navigate("dashboard/home");
                onClose();
              }}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Settings
            </div>
            <div className="border-t border-gray-100 my-1"></div>
          </>
        )}

        {/* Logout / Login Button */}
        <div
          onClick={() => {
            if (user) {
              setShowSignOutModal(true); // Show confirmation
            } else {
              navigate("/signin");
              onClose();
            }
          }}
          className={`px-4 py-2 cursor-pointer font-medium ${
            user
              ? "text-red-500 hover:bg-red-50"
              : "text-blue-600 hover:bg-blue-50"
          }`}
        >
          {user ? "Logout" : "Login"}
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
