import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  reauthenticateWithPopup,
} from "firebase/auth";
import { db } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Homepage Component
 * --------------------------------------------------
 * Displays user profile info and allows updating:
 * - Username
 * - Password (with reauthentication)
 * Includes animated modal feedback using Framer Motion.
 * Success messages also have subtle count/fade animation.
 */
const Homepage = () => {
  const { user } = useAuth();

  // ---------- Form states ----------
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ---------- Modal states ----------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);

  // Success animation
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  if (!user) return <div className="p-6">Please log in first.</div>;

  // ---------- Username Change Handler ----------
  const handleUsernameChange = async () => {
    if (!newName.trim()) return showModal("Username cannot be empty.");

    try {
      await updateProfile(user, { displayName: newName });
      await setDoc(
        doc(db, "users", user.uid),
        { username: newName },
        { merge: true }
      );
      setNewName("");
      showModal("Username updated successfully!", true);
    } catch (err) {
      console.error(err);
      showModal("Failed to update username: " + err.message);
    }
  };

  // ---------- Password Change Handler ----------
  const handlePasswordChange = () => {
    if (!newPassword.trim()) return showModal("Password cannot be empty.");
    if (newPassword.length < 6)
      return showModal("Password must be at least 6 characters.");

    setCurrentPasswordInput("");
    setModalMessage("Please enter your current password to confirm:");
    setModalOpen(true);
  };

  const confirmPasswordChange = async () => {
    setPasswordChanging(true);
    try {
      const providerId = user.providerData[0]?.providerId;

      if (providerId === "password") {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPasswordInput
        );
        await reauthenticateWithCredential(user, credential);
      } else if (providerId === "google.com") {
        const provider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, provider);
      } else {
        showModal("Password change not supported for this login method.");
        setPasswordChanging(false);
        return;
      }

      await updatePassword(user, newPassword);
      setNewPassword("");
      showModal("Password updated successfully!", true);
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential")
        showModal("Incorrect current password.");
      else showModal("Failed to update password: " + err.message);
    }

    setPasswordChanging(false);
    setModalOpen(false);
  };

  // ---------- Modal Helpers ----------
  const showModal = (message, success = false) => {
    setModalMessage(message);
    setModalOpen(true);

    if (success) {
      setShowSuccessAnim(true);
      setTimeout(() => setShowSuccessAnim(false), 1200); // Hide after animation
    }
  };
  const closeModal = () => setModalOpen(false);

  // ---------- Helper: Initials for Avatar ----------
  const getInitial = (name, email) => {
    if (name && name.trim().length > 0)
      return name.trim().charAt(0).toUpperCase();
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  // ---------- Framer Motion Variants ----------
  const cardVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const modalVariant = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const successAnimVariant = {
    hidden: { opacity: 0, y: 0, scale: 0.5 },
    visible: { opacity: 1, y: -30, scale: 1.2 },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* USER CARD */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-6 bg-gray-100 p-6 rounded shadow-lg hover:shadow-lg"
        initial="hidden"
        animate="visible"
        variants={cardVariant}
        transition={{ duration: 0.5 }}
      >
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-blue-900 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full border-4 border-blue-900 bg-blue-200 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-900">
              {getInitial(user?.displayName, user?.email)}
            </span>
          </div>
        )}

        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold text-blue-900">
            {user?.displayName || "User"}
          </h2>
          <p className="text-blue-900">{user?.email}</p>
        </div>
      </motion.div>

      {/* PROFILE SETTINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* CHANGE USERNAME */}
        <motion.div
          className="bg-gray-100 p-5 rounded shadow hover:shadow-lg transition-all duration-200"
          initial="hidden"
          animate="visible"
          variants={cardVariant}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            Change Username
          </h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new username"
            className="w-full p-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUsernameChange}
            className="mt-3 w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors"
          >
            Save Username
          </button>
        </motion.div>

        {/* CHANGE PASSWORD */}
        <motion.div
          className="bg-gray-100 p-5 rounded shadow hover:shadow-lg transition-all duration-200"
          initial="hidden"
          animate="visible"
          variants={cardVariant}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            Change Password
          </h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handlePasswordChange}
            className="mt-3 w-full py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
          >
            Save Password
          </button>
        </motion.div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariant}
            transition={{ duration: 0.25 }}
          >
            <div className="bg-gray-300 p-6 rounded w-96 text-gray-900 shadow-lg relative">
              <p className="mb-4">{modalMessage}</p>

              {/* Success animated indicator */}
              <AnimatePresence>
                {showSuccessAnim && (
                  <motion.div
                    className="absolute top-2 right-2 text-green-600 font-bold"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={successAnimVariant}
                    transition={{ duration: 1 }}
                  >
                    ✔
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Show input only for password confirmation */}
              {modalMessage.includes("current password") && (
                <input
                  type="password"
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  placeholder="Current password"
                  className="w-full p-2 rounded-lg text-black mb-4"
                />
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="py-1 px-3 bg-gray-100 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>

                {modalMessage.includes("current password") && (
                  <button
                    onClick={confirmPasswordChange}
                    className="py-1 px-3 bg-red-600 rounded hover:bg-red-700"
                    disabled={passwordChanging}
                  >
                    {passwordChanging ? "Saving..." : "Confirm"}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Homepage;
