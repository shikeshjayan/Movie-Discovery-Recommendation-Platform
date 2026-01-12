import { useState } from "react";
import { useWatchLater } from "../context/WatchLaterContext";
import WatchLaterCard from "../ui/WatchLaterCard";
import ConfirmModal from "../ui/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

/**
 * WatchLater Component
 * --------------------------------------------------
 * - Displays all movies saved in Watch Later
 * - Remove single or all movies with confirmation
 * - Framer Motion fade-in + hover animations
 * - Responsive grid layout
 */
const WatchLater = () => {
  const { watchLater, removeFromWatchLater, clearWatchLater } = useWatchLater();
  const navigate = useNavigate();

  // ---------------- Modal State ----------------
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(() => () => {});

  // ---------------- Single Remove ----------------
  const confirmRemove = (movieId, movieTitle) => {
    setModalTitle("Remove Movie?");
    setModalMessage(
      `Are you sure you want to remove "${movieTitle}" from Watch Later?`
    );
    setModalAction(() => () => removeFromWatchLater(movieId));
    setModalOpen(true);
  };

  // ---------------- Clear All ----------------
  const confirmRemoveAll = () => {
    setModalTitle("Clear Watch Later?");
    setModalMessage(
      "Are you sure you want to remove all movies from Watch Later?"
    );
    setModalAction(() => clearWatchLater);
    setModalOpen(true);
  };

  // ---------------- Empty State ----------------
  if (!watchLater.length) {
    return (
      <p className="text-center mt-10 text-gray-500">
        No movies in Watch Later list.
      </p>
    );
  }

  return (
    <div className="watch-later-page py-4 p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="lg:text-3xl font-bold">Watch Later</h2>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={confirmRemoveAll}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 hover:scale-105 transition-transform"
          >
            Remove All
          </motion.button>
        </div>
      </div>

      {/* Grid of Watch Later Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {watchLater.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.05 }}
            className="w-full aspect-2/3 object-cover"
          >
            <WatchLaterCard
              movie={movie}
              onClick={() => {
                const path =
                  movie.type === "tv"
                    ? `/tvshow/${movie.id}`
                    : `/movie/${movie.id}`;
                navigate(path);
              }}
              onRemove={() =>
                confirmRemove(movie.id, movie.title || movie.name)
              }
            />
          </motion.div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction(); // Execute delete
          setModalOpen(false); // Close modal
        }}
      />
    </div>
  );
};

export default WatchLater;
