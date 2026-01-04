import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader"
import TrailerButton from "../components/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";
import SimilarMovies from "./SimilarMovies";
import useMovieDetails from "../hooks/useMovieDetails";

const MovieCard = () => {
    const navigate = useNavigate()
    const { id } = useParams();

    const { movie, movieKey, loading } = useMovieDetails(id);

    if (loading || !movie || !movieKey) {
        return <MovieCardSkeleton />;
    }

    const backdropUrl = movie.backdrop_path
        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
        : "/fallback-backdrop.jpg";

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : "/fallback-poster.jpg";
    console.log(movie);

    return (
        <>
            <section className="movie-card relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">

                <button
                    onClick={() => navigate(-1)}
                    className="text-red-600 py-2 rounded fixed z-10 right-6 top-30 hover:text-blue-600"
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

                        <div className="flex flex-wrap justify-center items-center md:justify-start gap-3">
                            <span className="w-auto px-4 py-1 bg-yellow-500 text-black font-bold rounded text-sm">
                                ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
                            </span>
                            <span className="w-auto px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : ""}
                            </span>
                            <span className="w-auto text-center px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {movie.runtime} min
                            </span>
                        </div>

                        {/* Genres */}
                        <div className="flex flex-wrap justify-center items-center text-center md:justify-start gap-2">
                            {movie.genres?.map((g) => (
                                <span key={g.id} className="w-auto px-3 py-1 border border-gray-600 text-gray-300 rounded text-xs uppercase tracking-wide">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        <div>{movie.spoken_languages.map((lang) => {
                            return (
                                <div key={lang.name} className="w-20 px-3 py-1 border border-gray-600 text-gray-300 rounded text-xs uppercase tracking-wide">{lang.english_name}</div>
                            )
                        })}</div>

                        {/* Overview */}
                        <div className="max-w-2xl">
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Overview</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {movie.overview}
                            </p>
                        </div>

                        <div className="flex gap-2 items-center">
                            <TrailerButton movieKey={movieKey} />
                        </div>

                    </div>
                </div>
            </section>
            <SimilarMovies />
        </>
    );
};

export default MovieCard;
