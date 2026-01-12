import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { ThemeContext } from "../context/ThemeProvider";
import { useContext } from "react";
import { motion } from "framer-motion";

/**
 * SignOutModal Component
 * ----------------------
 * A confirmation modal for signing out the user with Framer Motion animations.
 *
 * Features:
 * - Only renders when `isOpen` is true
 * - Full-screen dark overlay with fade-in
 * - Modal card with scale-up and fade-in
 * - Theme-aware styling (dark/light)
 * - Animated Cancel and Sign Out buttons
 * - On confirm: signs out via Firebase and redirects to /signin
 *
 * Props:
 * - `isOpen` (boolean): Whether the modal is visible
 * - `onClose` (function): Called when user clicks Cancel or closes the modal
 */
const SignOutModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Don’t render anything if modal is closed
  if (!isOpen) return null;

  // Handle sign out
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={`p-6 rounded-lg shadow-lg max-w-xs w-full text-center
          ${
            theme === "dark"
              ? "bg-[#312F2C] text-[#FAFAFA]"
              : "bg-[#ECF0FF] text-[#312F2C]"
          }
        `}
      >
        <h3 className="text-lg font-semibold mb-4">Confirm Sign Out</h3>
        <p className="mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-center gap-4">
          {/* Cancel button with hover/tap animation */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-4 py-2 rounded hover:text-blue-600"
          >
            Cancel
          </motion.button>

          {/* Sign Out button with hover/tap animation */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSignOut}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SignOutModal;
