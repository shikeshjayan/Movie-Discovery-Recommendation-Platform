import { Link, useParams } from "react-router-dom";
import { similarMovies } from "../services/tmdbApi"
import { useEffect, useState } from "react";

const SimilarMovies = () => {
  const { id } = useParams();
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(true);

  // Fetch Similar
  useEffect(() => {
    let isMounted = true;

    const fetchSimilarMovies = async () => {
      try {
        setSimilarLoading(true);
        const data = await similarMovies(id);
        if (isMounted) {
          setSimilar(data || []);
        }
      } catch (error) {
        console.error("Failed to fetch similar movies", error);
      } finally {
        if (isMounted) {
          setSimilarLoading(false);
        }
      }
    };

    fetchSimilarMovies();

    return () => {
      isMounted = false;
    };
  }, [id]);


  return (
    <article className='flex flex-col gap-4'>
      <h4 className='popular-movies text-3xl'>Similar Movies</h4>
      {
        similarLoading && (
          <p className="text-gray-400 mt-6">Loading similar movies...</p>
        )
      }
      {
        !similarLoading && similar.length === 0 && (
          <p className="text-gray-500 mt-6">No similar movies found.</p>
        )
      }
      {/* Mapping Array of Popular_Movies_List */}
      <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-8 justify-items-center">
        {similar.slice(0, 16).map((movie) => {
          return (
            <div key={movie.id}>
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="no-underline block"
              >
                <div className="movie-case cursor-pointer">
                  <img src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.title} className="w-50 h-75 rounded shadow-md" />
                  <h5 className="w-50 px-2 px-auto">{movie.title}</h5>
                </div>
              </Link>
            </div>
          )
        })}
      </div>
    </article>
  )
}

export default SimilarMovies