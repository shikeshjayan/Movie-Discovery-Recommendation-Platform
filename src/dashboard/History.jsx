import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmModal from "../ui/ConfirmModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const History = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { isOpen, pendingId, type, openSingle, openClear, close } =
    useConfirmation();

  if (!history.length) return null;

  const confirmActionHandler = () => {
    if (type === "single") {
      removeFromHistory(pendingId); // ✅ remove only one item
    }

    if (type === "clear") {
      clearHistory(); // ✅ clear all items
    }

    close();
  };

  return (
    <section className="flex flex-col gap-4 px-4">
      <div className="flex items-center justify-between">
        <h4 className="popular-movies md:text-3xl">Recently Watched</h4>

        <button
          onClick={openClear}
          title="Clear watch history"
          className="cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#EA3323"
          >
            <path d="m656-120-56-56 84-84-84-84 56-56 84 84 84-84 56 56-83 84 83 84-56 56-84-83-84 83Zm-176 0q-138 0-240.5-91.5T122-440h82q14 104 92.5 172T480-200q11 0 20.5-.5T520-203v81q-10 1-19.5 1.5t-20.5.5ZM120-560v-240h80v94q51-64 124.5-99T480-840q150 0 255 105t105 255h-80q0-117-81.5-198.5T480-760q-69 0-129 32t-101 88h110v80H120Zm414 190-94-94v-216h80v184l56 56-42 70Z" />
          </svg>
        </button>
      </div>

      {/* Responsive Grid */}
      <div
        className="
      grid
      grid-cols-1
      sm:grid-cols-3
      md:grid-cols-4
      lg:grid-cols-5
      xl:grid-cols-6
      gap-6
    "
      >
        {history.map((item) => {
          const title = item.name || item.original_name || item.title;

          return (
            <Link
              key={item.id}
              to={`/movie/${item.id}`}
              className="group relative no-underline"
            >
              {/* Poster */}
              <div className="relative w-full aspect-[2/3] overflow-hidden rounded-lg shadow-md">
                <img
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* ❌ Remove single item */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openSingle(item.id);
                  }}
                  aria-label="Remove from history"
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
              <h5 className="mt-2 text-center text-sm truncate">{title}</h5>
            </Link>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        open={isOpen}
        onConfirm={confirmActionHandler}
        onCancel={close}
        title={
          type === "clear" ? "Clear watch history?" : "Remove from history"
        }
        message={
          type === "clear"
            ? "This will remove all watched items."
            : "This action cannot be undone."
        }
      />
    </section>
  );
};

export default History;
