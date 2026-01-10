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
import { db, storage } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Homepage = () => {
  const { user } = useAuth();
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentPasswordInput, setCurrentPasswordInput] = useState("");
  const [passwordChanging, setPasswordChanging] = useState(false);

  if (!user) return <div className="p-6">Please log in first.</div>;

  // ---------- Username Change ----------
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
      showModal("Username updated successfully!");
    } catch (err) {
      console.error(err);
      showModal("Failed to update username: " + err.message);
    }
  };

  // ---------- Profile Image Change ----------
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error(error);
          showModal("Upload failed: " + error.message);
          setUploading(false);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: url });
          await setDoc(
            doc(db, "users", user.uid),
            { photoURL: url },
            { merge: true }
          );
          showModal("Profile image updated!");
          setUploading(false);
        }
      );
    } catch (err) {
      console.error(err);
      showModal("Failed to update image: " + err.message);
      setUploading(false);
    }
  };

  // ---------- Password Change ----------
  const handlePasswordChange = () => {
    if (!newPassword.trim()) return showModal("Password cannot be empty.");
    if (newPassword.length < 6)
      return showModal("Password must be at least 6 characters.");

    // Open modal to ask current password
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
      showModal("Password updated successfully!");
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential")
        showModal("Incorrect current password.");
      else showModal("Failed to update password: " + err.message);
    }
    setPasswordChanging(false);
    setModalOpen(false);
  };

  // ---------- Modal Helper ----------
  const showModal = (message) => {
    setModalMessage(message);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* USER CARD */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-100 p-6 rounded shadow-lg hover:shadow-lg">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-900 object-cover"
        />
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold text-blue-900">
            {user?.displayName || "User"}
          </h2>
          <p className="text-blue-900">{user?.email}</p>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHANGE IMAGE */}
        <div className="bg-gray-100 p-5 rounded shadow hover:shadow-lg transition-all duration-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            Change Image
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm w-full file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-100 file:text-blue-900
              hover:file:bg-blue-700
              cursor-pointer"
          />
          {uploading && (
            <p className="text-gray-400 mt-2 text-sm">
              Uploading... {uploadProgress.toFixed(0)}%
            </p>
          )}
        </div>

        {/* CHANGE USERNAME */}
        <div className="bg-gray-100 p-5 rounded shadow hover:shadow-lg transition-all duration-200">
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
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-gray-100 p-5 rounded shadow hover:shadow-lg transition-all duration-200">
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
        </div>
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-300 p-6 rounded w-96 text-gray-900 shadow-lg">
            <p className="mb-4">{modalMessage}</p>

            {/* Show input only when confirming password */}
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

              {/* Only show confirm button when entering password */}
              {modalMessage.includes("current password") ? (
                <button
                  onClick={confirmPasswordChange}
                  className="py-1 px-3 bg-red-600 rounded hover:bg-red-700"
                  disabled={passwordChanging}
                >
                  {passwordChanging ? "Saving..." : "Confirm"}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
