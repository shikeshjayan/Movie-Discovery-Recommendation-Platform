// ProfileDropdown.jsx
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase"; // adjust path
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfileDropdown = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  if (!isOpen) return null;

  const handleAuthAction = async () => {
    if (user) {
      await logout();
    }
    navigate("/signin");
    onClose();
  };

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    navigate("/signin");
  };

  return (
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
              navigate("/settings");
              onClose();
            }}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Settings
          </div>
          <div className="border-t border-gray-100 my-1"></div>
        </>
      )}

      {/* 3. Dynamic Button Text */}
      <div
        onClick={handleAuthAction}
        className={`px-4 py-2 cursor-pointer font-medium ${
          user
            ? "text-red-500 hover:bg-red-50"
            : "text-blue-600 hover:bg-blue-50"
        }`}
      >
        {user ? "Logout" : "Login"}
      </div>
    </div>
  );
};

export default ProfileDropdown;
