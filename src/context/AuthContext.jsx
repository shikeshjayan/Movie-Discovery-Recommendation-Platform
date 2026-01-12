import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

/**
 * AuthContext
 * --------------------------------------------------
 * Holds authentication-related data and actions
 * (current user, logout function).
 */
const AuthContext = createContext(null);

/**
 * AuthProvider
 * --------------------------------------------------
 * Wraps the application and provides authentication
 * state to all child components.
 */
export const AuthProvider = ({ children }) => {
  // Stores the currently authenticated Firebase user
  const [user, setUser] = useState(null);

  // Tracks whether Firebase auth state is still loading
  const [loading, setLoading] = useState(true);

  /**
   * Subscribe to Firebase authentication state changes.
   * This runs once on component mount.
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set logged-in user (or null)
      setLoading(false); // Stop loading after auth check
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  /**
   * Logs out the current user
   */
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  /**
   * Show loading screen while checking auth status
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  /**
   * Provide auth state and actions to the app
   */
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth
 * --------------------------------------------------
 * Custom hook to access authentication context
 * anywhere in the application.
 */
export const useAuth = () => useContext(AuthContext);
