import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, updatePassword } from "firebase/auth";
import { db, storage } from "../services/firebase";
import { doc, setDoc } from "firebase/firestore"; // Changed: use setDoc
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Homepage = () => {
  const { user } = useAuth();
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [uploading, setUploading] = useState(false);

  // Show a message if user is not logged in
  if (!user) {
    return <div className="p-6">Please log in first.</div>;
  }

  // ---------- Change Username ----------
  const handleUsernameChange = async () => {
    if (!newName.trim()) {
      alert("Username cannot be empty");
      return;
    }

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: newName });

      // Create or update Firestore user document
      await setDoc(
        doc(db, "users", user.uid),
        { username: newName },
        { merge: true } // ← This creates the doc if it doesn't exist
      );

      setNewName("");
      alert("Username updated!");
    } catch (err) {
      console.error("Error updating username:", err);
      alert("Failed to update username: " + err.message);
    }
  };

  // ---------- Change Profile Image ----------
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL: url });

      // Create or update Firestore user document
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: url },
        { merge: true } // ← This creates the doc if it doesn't exist
      );

      alert("Profile image updated!");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to update image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ---------- Change Password ----------
  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      alert("Password cannot be empty");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      await updatePassword(user, newPassword);
      setNewPassword("");
      alert("Password updated!");
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password: " + err.message);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* USER CARD */}
      <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-900 p-6 rounded-xl shadow-lg">
        <img
          src={user?.photoURL || "/default-avatar.png"}
          alt="Profile"
          className="w-24 h-24 rounded-full border-4 border-blue-600 object-cover"
        />
        <div className="text-center sm:text-left mt-4 sm:mt-0">
          <h2 className="text-2xl font-bold text-white">
            {user?.displayName || "User"}
          </h2>
          <p className="text-gray-400">{user?.email}</p>
        </div>
      </div>

      {/* PROFILE SETTINGS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* CHANGE IMAGE */}
        <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition-all duration-200">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Change Image
          </h3>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm w-full file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-700
              cursor-pointer"
          />
          {uploading && (
            <p className="text-gray-400 mt-2 text-sm">Uploading...</p>
          )}
        </div>

        {/* CHANGE USERNAME */}
        <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition-all duration-200">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Change Username
          </h3>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new username"
            className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleUsernameChange}
            className="mt-3 w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Save Username
          </button>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-gray-800 p-5 rounded-xl shadow hover:shadow-lg transition-all duration-200">
          <h3 className="text-lg font-semibold mb-4 text-white">
            Change Password
          </h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full p-3 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handlePasswordChange}
            className="mt-3 w-full py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Save Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
