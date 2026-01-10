import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { useConfirmation } from "../hooks/useConfirmation";
import ConfirmModal from "../ui/ConfirmModal";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WatchHistory = () => {
  const { history, removeFromHistory, clearHistory } = useHistory();
  const { isOpen, pendingId, type, openSingle, openClear, close } =
    useConfirmation();

  if (!history.length) return null;

  const confirmActionHandler = () => {
    if (type === "single") {
      removeFromHistory(pendingId);
    }

    if (type === "clear") {
      clearHistory();
    }

    close();
  };

  return (
    <section className="flex flex-col gap-4">
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

      <div
        className="flex gap-4 overflow-x-auto pb-4 
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]"
      >
        {history.map((item) => (
          <Link
            key={item.id}
            to={`/movie/${item.id}`}
            className="group relative no-underline shrink-0 snap-start max-w-50"
          >
            <div className="movie-case relative w-50">
              <img
                src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt={item.title}
                className="w-full rounded shadow-md"
              />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openSingle(item.id);
                }}
                aria-label="Remove from history"
                className="
    absolute top-2 right-2
    bg-black/70 hover:bg-red-600
    text-white
    rounded-full
    w-7 h-7
    flex items-center justify-center
    opacity-0 group-hover:opacity-100
    transition
  "
              >
                <FontAwesomeIcon icon={faXmark} size="sm" />
              </button>
            </div>

            <h5 className="mt-2 text-center text-sm ">
              {item.name || item.original_name || item.title}
            </h5>
          </Link>
        ))}
      </div>

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

export default WatchHistory;
