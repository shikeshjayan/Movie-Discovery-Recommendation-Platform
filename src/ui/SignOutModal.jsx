import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext } from "react";

const SignOutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out. Please try again.");
    } finally {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={`p-6 rounded-lg shadow-lg max-w-xs w-full text-center
        ${
          theme === "dark"
            ? "bg-[#312F2C] text-[#FAFAFA]"
            : "bg-[#ECF0FF] text-[#312F2C]"
        }
        `}
      >
        <h3 className="text-lg font-semibold mb-4">
          Confirm Sign Out
        </h3>
        <p className="mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded hover:text-blue-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOutModal;
