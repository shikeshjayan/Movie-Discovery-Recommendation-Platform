import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader";
import TrailerButton from "../components/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";
import SimilarMovies from "./SimilarMovies";
import useMovieDetails from "../hooks/useMovieDetails";
import { useState } from "react";
import CastWindow from "./CastWindow";
import ReviewWindow from "./ReviewWindow";
import CommentBox from "../components/CommentBox";
import { useWishlist } from "../context/WishlistContext";

const MovieCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

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

  return (
    <>
      <section className="movie-card relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="hidden sm:block text-red-600 py-2 rounded fixed z-10 right-6 top-30 hover:text-blue-600"
        >
          Close
        </button>

        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 blur-sm"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        ></div>

        <div className="absolute inset-0"></div>

        <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="shrink-0 w-64 md:w-80 lg:w-96 rounded shadow-2xl overflow-hidden">
            <ImageWithLoader
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 shadow-2xl"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4 space-y-6 text-center md:text-left">
            <div>
              <div className="flex gap-10 items-center">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="26px"
                      viewBox="0 -960 960 960"
                      width="26px"
                      fill="#8B1A10"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="26px"
                      viewBox="0 -960 960 960"
                      width="26px"
                      fill="#e3e3e3"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z" />
                    </svg>
                  )}
                </button>
              </div>
              {movie.tagline && (
                <p className="text-lg text-gray-400 italic mt-2">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center items-center md:justify-start gap-3">
              <span className="w-auto px-4 py-1 text-yellow-500 font-bold text-md">
                ★ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="w-auto px-3 py-1 text-gray-200 text-sm">
                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : ""}
              </span>
              <span className="w-auto text-center px-3 py-1 text-gray-200 text-sm">
                {movie.runtime} min
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center items-center text-center md:justify-start gap-2">
              {movie.genres?.map((g) => (
                <span
                  key={g.id}
                  className="w-auto px-3 py-1 text-gray-300  text-xs uppercase tracking-wide"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <div className="flex">
              {movie.spoken_languages?.map((lang) => {
                return (
                  <div
                    key={lang.name}
                    className="w-20 px-3 py-1 text-gray-300  text-xs uppercase tracking-wide"
                  >
                    {lang.english_name}
                  </div>
                );
              })}
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

            <div className="flex gap-2 items-center">
              <TrailerButton movieKey={movieKey} />
            </div>
          </div>
        </div>
      </section>
      <CastWindow />
      <hr />
      <CommentBox
        contentId={String(movie.id)}
        contentTitle={movie.title}
        contentType="movie"
      />
      <hr className="text-blue-400 mx-4" />
      <ReviewWindow />
      <hr className="text-blue-400 mx-4" />
      <SimilarMovies />
      <hr />
    </>
  );
};

export default MovieCard;
