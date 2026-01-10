import { useState, useEffect } from "react";
import { auth, storage, db } from "../services/firebase"; 
import {
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MySpace = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("/Loader.svg");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setUsername(currentUser.displayName || "");
        setImagePreview(currentUser.photoURL || "/Loader.svg");
      } else {
        setUser(null);
        setUsername("");
        setImagePreview("/Loader.svg");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen bg-red-300 flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen bg-red-300 flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImage = async () => {
    if (!imageFile) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profilePics/${user.uid}`);
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(user, {
        photoURL: downloadURL,
      });

      setUser({ ...user, photoURL: downloadURL });
      setImageFile(null);
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await sendEmailVerification(user);
      alert("Verification email sent! Check your inbox.");
    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Failed to send verification email: " + error.message);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Update displayName in Firebase Auth
      await updateProfile(user, {
        displayName: username,
      });

      // Also save to Firestore (users collection)
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date(),
      });

      setUser({ ...user, displayName: username });
      alert("Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile: " + error.message);
    }
  };

  return (
    <div className="w-screen h-screen bg-red-300 flex items-center justify-center">
      <div className="md:w-300 md:h-150 border flex flex-col items-center justify-center p-4">
        {/* Profile image + camera */}
        <div className="relative mb-6">
          <img
            src={imagePreview}
            alt="Profile"
            className="w-50 h-50 rounded-full"
          />
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
          id="profile-pic-upload"
        />

        {/* Upload button */}
        <label
          htmlFor="profile-pic-upload"
          className="text-sm text-blue-600 underline hover:text-blue-800 cursor-pointer mb-4"
        >
          {uploading ? "Uploading..." : "Change Profile Picture"}
        </label>

        {imageFile && (
          <button
            type="button"
            onClick={handleUploadImage}
            disabled={uploading}
            className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 disabled:bg-gray-400 mb-4"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        )}

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSaveProfile}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-blue-300">
              Username
            </label>
            <input
              id="name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border text-[#312F2C] border-blue-300 rounded px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-blue-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              readOnly
              className="w-full border text-[#312F2C] border-blue-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Show Verify Email button only if email is not verified */}
          {!user.emailVerified && (
            <button
              type="button"
              onClick={handleVerifyEmail}
              className="text-sm text-orange-600 underline hover:text-orange-800"
            >
              Verify Email
            </button>
          )}

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default MySpace;
