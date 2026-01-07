import { useEffect, useState } from "react";
import { popularTVShows } from "../services/tmdbApi";
import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Moviecase = () => {
  const [popularShowsList, setPopularShowsList] = useState([]);
  const { addToHistory } = useHistory();

  useEffect(() => {
    popularTVShows().then(setPopularShowsList);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h4 className="popular-movies text-3xl">Popular TV Shows</h4>

      <div
        className="flex gap-4 overflow-x-auto pb-4
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 hover:dark:[&::-webkit-scrollbar-thumb]:bg-blue-500"
      >
        {popularShowsList.map((shows) => (
          <Link
            key={shows.id}
            to={`/tvshow/${shows.id}`}
            onClick={() =>
              addToHistory({
                id: shows.id,
                title: shows.title,
                poster_path: shows.poster_path,
                vote_average: shows.vote_average,
                type: "shows",
              })
            }
            className="group relative no-underline shrink-0"
          >
            <div className="movie-case relative w-50">
              <img
                src={`https://image.tmdb.org/t/p/w342${shows.poster_path}`}
                alt={shows.title}
                className="w-full rounded shadow-md"
              />

              <span className="absolute bottom-2 left-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ★ {shows.vote_average?.toFixed(1) ?? "N/A"}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault(); // prevent navigation
                  console.log("Wishlisted");
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <FontAwesomeIcon icon={faHeart} style={{ color: "#FFFFFF" }} />
              </button>
            </div>

            <h5 className="mt-2 text-center">{shows.title}</h5>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Moviecase;
