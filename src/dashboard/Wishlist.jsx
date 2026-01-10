import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import ConfirmModal from "../ui/ConfirmModal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  if (!wishlist.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 text-gray-400">
        <p className="text-lg">Your wishlist is empty ❤️</p>
        <p className="text-sm mt-2">Add movies or TV shows to see them here</p>
      </div>
    );
  }

  const handleRemoveClick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    if (openModal) return;
    setSelectedItem(item);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const confirmRemove = () => {
    if (!selectedItem) return;
    removeFromWishlist(selectedItem.id, selectedItem.type);
    closeModal();
  };

  return (
    <>
      <section className="px-4">
        <h4 className="popular-movies md:text-3xl mb-4">My Wishlist</h4>

        {/* Responsive Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-6
          "
        >
          {wishlist.map((item) => {
            const title = item.title || item.name || item.original_name;

            return (
              <div
                key={`${item.id}-${item.type}`}
                role="button"
                tabIndex={0}
                onClick={() =>
                  navigate(
                    item.type === "movie"
                      ? `/movie/${item.id}`
                      : `/tvshow/${item.id}`
                  )
                }
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate(
                    item.type === "movie"
                      ? `/movie/${item.id}`
                      : `/tvshow/${item.id}`
                  )
                }
                className="group cursor-pointer"
              >
                {/* Poster */}
                <div className="relative w-full aspect-2/3 overflow-hidden rounded-lg shadow-md">
                  <img
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
                        : "/loader.jpg"
                    }
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Remove button */}
                  <button
                    onClick={(e) => handleRemoveClick(e, item)}
                    className="
    absolute top-2 right-2
    text-red-600
    rounded-full
    w-7 h-7
    flex items-center justify-center
    z-20
  "
                  >
                    <FontAwesomeIcon icon={faXmark} size="sm" />
                  </button>
                </div>

                {/* Title */}
                <h5 className="mt-2 text-sm text-center truncate">{title}</h5>
              </div>
            );
          })}
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={openModal}
        title="Remove from wishlist"
        message="This action cannot be undone."
        onCancel={closeModal}
        onConfirm={confirmRemove}
      />
    </>
  );
};

export default Wishlist;
