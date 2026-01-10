import { useState } from "react";
import { useWatchLater } from "../context/WatchLaterContext";
import WatchLaterCard from "../ui/WatchLaterCard";
import ConfirmModal from "../ui/ConfirmModal";
import { useNavigate } from "react-router-dom";

const WatchLater = () => {
  const { watchLater, removeFromWatchLater, clearWatchLater } = useWatchLater();
  const navigate = useNavigate();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(() => () => {});

  // Show confirmation for single remove
  const confirmRemove = (movieId, movieTitle) => {
    setModalTitle("Remove Movie?");
    setModalMessage(
      `Are you sure you want to remove "${movieTitle}" from Watch Later?`
    );
    setModalAction(() => () => removeFromWatchLater(movieId));
    setModalOpen(true);
  };

  // Show confirmation for remove all
  const confirmRemoveAll = () => {
    setModalTitle("Clear Watch Later?");
    setModalMessage(
      "Are you sure you want to remove all movies from Watch Later?"
    );
    setModalAction(() => clearWatchLater);
    setModalOpen(true);
  };

  if (!watchLater.length)
    return <p className="text-center mt-10">No movies in Watch Later list.</p>;

  return (
    <div className="watch-later-page py-4 px-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl">Watch Later</h2>

        {/* Remove All Button */}
        <button
          onClick={confirmRemoveAll}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Remove All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-10 justify-items-center">
        {watchLater.map((movie) => (
          <WatchLaterCard
            key={movie.id}
            movie={movie}
            onClick={() => navigate(`/movie/${movie.id}`)}
            onRemove={() => confirmRemove(movie.id, movie.title || movie.name)}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={modalOpen}
        title={modalTitle}
        message={modalMessage}
        onCancel={() => setModalOpen(false)}
        onConfirm={() => {
          modalAction(); // execute delete
          setModalOpen(false); // close modal
        }}
      />
    </div>
  );
};

export default WatchLater;
