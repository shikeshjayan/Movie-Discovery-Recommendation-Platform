import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader";
import TrailerButton from "../components/TrailerButton";
import MediaDetailsSkeleton from "../ui/MediaDetailsSkeleton";
import SimilarMovies from "./SimilarMovies";
import useMovieDetails from "../hooks/useMovieDetails";
import CastWindow from "./CastWindow";
import ReviewWindow from "./ReviewWindow";
import CommentBox from "../components/CommentBox";
import { useWishlist } from "../context/WishlistContext";
import { motion } from "framer-motion";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

/**
 * MovieCard Component
 * --------------------------------------------------
 * Displays detailed information about a single movie:
 * - Backdrop and poster with hover effect
 * - Title, tagline, rating, genres, language, and runtime
 * - Wishlist toggle
 * - Trailer button
 * - Cast, reviews, comments, and similar movies
 */
const MovieCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { movie, movieKey, loading } = useMovieDetails(id);

  // Show skeleton while loading
  if (loading || !movie || !movieKey) return <MediaDetailsSkeleton />;

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : "/fallback-backdrop.jpg";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "/fallback-poster.jpg";

  return (
    <section className="py-4">
      {/* Main Movie Section */}
      <div className="relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:block text-red-600 py-2 rounded fixed z-10 right-6 top-30 hover:text-blue-600"
        >
          Close
        </button>

        {/* Blurred Backdrop */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 blur-sm"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>
        <div className="absolute inset-0"></div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:items-start gap-10">
          {/* Poster Image */}
          <motion.div
            className="shrink-0 w-64 md:w-80 lg:w-96 rounded shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          >
            <ImageWithLoader
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Movie Details */}
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
            {/* Title & Wishlist */}
            <div className="flex flex-col md:flex-row gap-10 items-center">
              <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                {movie.title || movie.name}
              </h1>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  isInWishlist(movie.id, "movie")
                    ? removeFromWishlist(movie.id, "movie")
                    : addToWishlist({
                        id: movie.id,
                        title: movie.title,
                        poster_path: movie.poster_path,
                        vote_average: movie.vote_average,
                        type: "movie",
                      });
                }}
                className="ml-4 text-white rounded-full p-2 transition"
                aria-label="Add to wishlist"
              >
                {isInWishlist(movie.id, "movie") ? (
                  <FontAwesomeIcon
                    icon={faHeart}
                    style={{ color: "#ff0000" }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faHeart} />
                )}
              </button>
            </div>

            {/* Tagline */}
            {movie.tagline && (
              <p className="text-lg text-gray-400 italic mt-2">
                "{movie.tagline}"
              </p>
            )}

            {/* Ratings, Release Year, Runtime */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
              <span className="px-4 py-1 text-yellow-500 font-bold text-md">
                ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
              </span>
              {movie.release_date && (
                <span className="px-3 py-1 text-gray-200 text-sm">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              <span className="px-3 py-1 text-gray-200 text-sm">
                {movie.runtime} min
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 text-xs uppercase tracking-wide">
              {movie.genres?.map((g) => (
                <span key={g.id} className="px-3 py-1 text-gray-300">
                  {g.name}
                </span>
              ))}
            </div>

            {/* Languages */}
            <div className="flex flex-wrap gap-2">
              {movie.spoken_languages?.map((lang) => (
                <span
                  key={lang.name}
                  className="px-3 py-1 text-gray-300 text-xs uppercase tracking-wide"
                >
                  {lang.english_name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold mb-2 text-gray-200">
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview}
              </p>
            </div>

            {/* Trailer Button */}
            <div className="flex gap-4 items-center justify-center md:justify-start">
              <TrailerButton movieKey={movieKey} />
            </div>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <CastWindow />

      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />

      {/* Comments & Reviews */}
      <CommentBox
        contentId={String(movie.id)}
        contentTitle={movie.title}
        contentType="movie"
      />
      
      <ReviewWindow />

      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />

      {/* Similar Movies */}
      <SimilarMovies />
      <hr />
    </section>
  );
};

export default MovieCard;
