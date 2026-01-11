import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Overview = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;

  const MotionLink = motion(Link);

  const titleVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.6 } },
    exit: { y: 60, opacity: 0, transition: { duration: 0.4 } },
  };

  return (
    <section className="overview relative min-h-screen w-full">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center text-white px-6">
        <motion.h5
          variants={titleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-lg italic mb-2 animate-pulse text-[#0073ff]"
        >
          Recommended Movie Database
        </motion.h5>

        <motion.h1
          variants={titleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-4xl sm:text-6xl font-extrabold mb-4"
        >
          Welcome to RMDB
        </motion.h1>

        <motion.p
          variants={titleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="text-lg sm:text-xl mb-8"
        >
          Unlimited movies, shows recommendations — anytime, anywhere.
        </motion.p>

        <motion.div
          variants={titleVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex gap-4"
        >
          <MotionLink
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            to="/signin"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Login
          </MotionLink>
          <MotionLink
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            to="/signup"
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
          >
            Sign Up
          </MotionLink>
        </motion.div>
      </div>
    </section>
  );
};

export default Overview;
