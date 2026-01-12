import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

/**
 * Overview Component
 * ------------------
 * Landing page for unauthenticated users:
 * - Shows a hero section with title, subtitle, description, and CTA buttons
 * - Redirects to /home if user is already logged in
 * - Uses Framer Motion for smooth entrance animations
 */
const Overview = () => {
  const { user, loading } = useAuth();

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // Redirect logged-in users to /home
  if (user) return <Navigate to="/home" replace />;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.25, ease: "easeOut" },
    },
    tap: { scale: 0.97 },
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: "url('/over.jpg')" }}
      />

      {/* Gradient overlay to darken background */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/85 to-black"></div>

      {/* Main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-6"
      >
        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="mb-4 text-sm sm:text-base tracking-widest uppercase text-blue-400"
        >
          Curated Movie Experience
        </motion.p>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Welcome to Recommended Movie Database
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-12 lg:max-w-2xl lg:text-lg sm:text-xl text-gray-300 leading-relaxed"
        >
          Discover expertly recommended movies and shows — personalized,
          unlimited, and always available.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-5 w-full max-w-md"
        >
          {/* Sign In Button */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full"
          >
            <Link
              to="/signin"
              aria-label="Login to your account"
              className="block w-full rounded-md px-8 py-4 text-lg font-semibold text-white 
                         bg-linear-to-r from-blue-600 to-blue-700
                         hover:from-blue-700 hover:to-blue-800
                         transition-all duration-300 shadow-lg text-center"
            >
              Sign In
            </Link>
          </motion.div>

          {/* Sign Up Button */}
          <motion.div
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className="w-full"
          >
            <Link
              to="/signup"
              aria-label="Create a new account"
              className="block w-full rounded-md px-8 py-4 text-lg font-semibold text-white 
                         bg-white/10 backdrop-blur-md
                         hover:bg-white/20
                         border border-white/20
                         transition-all duration-300 shadow-lg text-center"
            >
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Overview;
