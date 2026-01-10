import { useEffect, useState } from "react";
import { recommendations } from "../services/tmdbApi";
import { useHistory } from "../context/HistoryContext";
import { Link } from "react-router-dom";

const Recommendations = () => {
  const { history } = useHistory();
  const [recommendedMovies, setRecommendedMovies] = useState([]);

  useEffect(() => {
    const fetchRecs = async () => {
      if (history.length > 0) {
        const lastMovieId = history[0].id;
        const recs = await recommendations(lastMovieId);
        setRecommendedMovies(recs);
      }
    };

    fetchRecs();
  }, [history]);
  return (
    <div className="p-6">
  <section>
    <h2 className="text-xl font-semibold mb-4">
      Recommended for You
    </h2>
    <div className="flex overflow-x-auto gap-4 pb-4">
      {recommendedMovies.map((movie) => (
        <Link
          to={`/movie/${movie.id}`}
          key={movie.id}
          className="min-w-40 hover:scale-105 transition-transform"
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-md w-full"
          />
          <p className="mt-2 text-sm font-semibold">{movie.title}</p>
        </Link>
      ))}
    </div>
  </section>
</div>
  );
};

export default Recommendations;
