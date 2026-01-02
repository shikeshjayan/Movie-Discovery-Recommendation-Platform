import { useEffect, useState } from "react";
import { movieDetails, movieVideos, similarMovies } from "../services/tmdbApi";
import { Link, useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader"
import TrailerButton from "../ui/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";

const MovieCard = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [movieKey, setMovieKey] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similar, setSimilar] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(true);



    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            const data = await movieDetails(id);
            setMovie(data);
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    useEffect(() => {

        const fetchVideos = async () => {
            const data = await movieVideos(id);
            setMovieKey(data);
        };
        fetchVideos()
    }, [id])
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


    if (loading || !movie) {
        return <MovieCardSkeleton />;
    }
    if (!movieKey) {
        return <div className="h-screen flex items-center justify-center text-white text-xl">Loading...</div>;
    }

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

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "/fallback-backdrop.jpg";

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/fallback-poster.jpg";






    return (
        <>
            <section className="movie-card relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">

                <button
                    onClick={() => navigate("/movies")}
                    className="text-white py-2 rounded absolute z-20 right-4 top-4 hover:text-blue-600"
                >
                    Close
                </button>

                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 blur-sm"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                ></div>


                <div className="absolute inset-0"></div>


                <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:items-start gap-10">


                    <div className="shrink-0 w-64 md:w-80 lg:w-96 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800/50">
                        <ImageWithLoader
                            src={posterUrl}
                            alt={movie.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-4 space-y-6 text-center md:text-left">


                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                                {movie.title || movie.name}
                            </h1>
                            {movie.tagline && (
                                <p className="text-lg text-gray-400 italic mt-2">"{movie.tagline}"</p>
                            )}
                        </div>

                        <div style={{ padding: "5px" }} className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span style={{ padding: "5px" }} className="w-14 px-3 py-1 bg-yellow-500 text-black font-bold rounded text-sm">
                                ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                            </span>
                            <span style={{ padding: "5px" }} className="w-14 px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
                            </span>
                            <span style={{ padding: "5px" }} className="w-20 text-center px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {movie.runtime} min
                            </span>
                        </div>

                        {/* Genres */}
                        <div style={{ padding: "5px" }} className="flex flex-wrap justify-center text-center md:justify-start gap-2">
                            {movie.genres?.map((g) => (
                                <span key={g.id} className="w-25 px-3 py-1 border border-gray-600 text-gray-300 rounded text-xs uppercase tracking-wide">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <div className="max-w-2xl">
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Overview</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {movie.overview}
                            </p>
                        </div>

                        <TrailerButton movieKey={movieKey} />

                    </div>
                </div>
            </section>
            <article className='flex flex-col gap-4'>
                <h4 className='popular-movies text-3xl'>Similar Movies</h4>
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
        </>
    );
};

export default MovieCard;
