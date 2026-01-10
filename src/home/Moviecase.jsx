import { useEffect, useState } from "react";
import { popularMovies } from "../services/tmdbApi";
import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";

const Moviecase = () => {
  const [popularMoviesList, setPopularMoviesList] = useState([]);
  const { addToHistory } = useHistory();

  useEffect(() => {
    popularMovies().then(setPopularMoviesList);
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <h4 className="popular-movies text-3xl">Popular Movies</h4>

      <div
        className="flex gap-4 overflow-x-auto pb-4
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]"
      >
        {popularMoviesList.map((movie) => (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            onClick={() =>
              addToHistory({
                id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                type: "movie",
              })
            }
            className="group relative no-underline shrink-0"
          >
            <div className="movie-case relative w-50">
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded shadow-md"
              />

              <span className="absolute bottom-2 left-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
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

            <h5 className="mt-2 text-center">{movie.title}</h5>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Moviecase;
