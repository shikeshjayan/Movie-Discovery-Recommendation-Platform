import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader";
import TrailerButton from "../components/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";
import SimilarTvShows from "./SimilarTvShows";
import useTvShowDetails from "../hooks/useTvShowDetails";
import { useState } from "react";
import CastWindow from "./CastWindow";
import ReviewWindow from "./ReviewWindow";

const MovieCard = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { shows, showKey, loading } = useTvShowDetails(id);
  const [wishlisted, setWishlisted] = useState(false);

  if (loading || !shows || !showKey) {
    return <MovieCardSkeleton />;
  }

  const handleWishlistIcon = () => {
    setWishlisted(!wishlisted);
    wishlisted === true;
  };
  console.log(wishlisted);

  const backdropUrl = shows.backdrop_path
    ? `https://image.tmdb.org/t/p/original${shows.backdrop_path}`
    : "/fallback-backdrop.jpg";

  const posterUrl = shows.poster_path
    ? `https://image.tmdb.org/t/p/w500${shows.poster_path}`
    : "/fallback-poster.jpg";

  return (
    <>
      <section className="tv_show-card relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="text-red-500 py-2 rounded fixed z-10 right-6 top-30 hover:text-blue-600"
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
              alt={shows.title || shows.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500 shadow-2xl"
            />
          </div>

          <div className="flex-1 flex flex-col gap-4 space-y-6 text-center md:text-left">
            <div>
              <div className="flex gap-10 items-center">
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                  {shows.title || shows.name}
                </h1>
                <span onClick={handleWishlistIcon} className="cursor-pointer">
                  {wishlisted === true ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#8B1A10"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#e3e3e3"
                    >
                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                    </svg>
                  )}
                </span>
              </div>
              {shows.tagline && (
                <p className="text-lg text-gray-400 italic mt-2">
                  "{shows.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="w-auto px-4 py-1 text-yellow-500 font-bold text-md">
                ★ {shows.vote_average ? shows.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="w-auto px-4 py-1 text-gray-200 text-sm">
                {shows.first_air_date
                  ? new Date(shows.first_air_date).getFullYear()
                  : ""}
              </span>
              <span className="w-auto px-4 py-1 text-gray-200 text-sm">
                {shows.runtime} min
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center text-center md:justify-start gap-2">
              {shows.genres?.map((g) => (
                <span
                  key={g.id}
                  className="w-auto px-4 py-1 text-gray-300 text-xs uppercase tracking-wide"
                >
                  {g.name}
                </span>
              ))}
            </div>
            <div className="flex">
              {shows.spoken_languages.map((lang) => {
                return (
                  <div
                    key={lang.name}
                    className="w-20 px-3 py-1 text-gray-300 text-xs uppercase tracking-wide"
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
                {shows.overview}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <TrailerButton movieKey={showKey} />
            </div>
          </div>
        </div>
      </section>
      <CastWindow />
      <hr className="text-blue-400 mx-4" />
      <ReviewWindow />
      <hr className="text-blue-400 mx-4" />
      <SimilarTvShows />
      <hr />
    </>
  );
};

export default MovieCard;
