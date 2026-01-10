import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader";
import TrailerButton from "../components/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";
import SimilarTvShows from "./SimilarTvShows";
import useTvShowDetails from "../hooks/useTvShowDetails";
import CastWindow from "./CastWindow";
import ReviewWindow from "./ReviewWindow";
import { useWishlist } from "../context/WishlistContext";
import CommentBox from "../components/CommentBox";

const TvShowCard = () => {
  // ✅ Renamed for clarity
  const navigate = useNavigate();
  const { id } = useParams();
  const { shows, showKey, loading } = useTvShowDetails(id);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (loading || !shows || !showKey) {
    return <MovieCardSkeleton />;
  }

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
          className="hidden sm:block text-red-500 py-2 rounded fixed z-10 right-6 top-16 hover:text-blue-600" // ✅ Fixed top-30 → top-16
        >
          Close
        </button>

        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 blur-sm"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />

        <div className="absolute inset-0" />

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
                <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {shows.title || shows.name}
                </h1>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    isInWishlist(shows.id, "shows")
                      ? removeFromWishlist(shows.id, "shows")
                      : addToWishlist({
                          id: shows.id,
                          title: shows.name || shows.title,
                          poster_path: shows.poster_path,
                          vote_average: shows.vote_average,
                          type: "shows",
                        });
                  }}
                  className="ml-4 text-white rounded-full p-2 transition hover:scale-110"
                  aria-label="Add to wishlist"
                >
                  {isInWishlist(shows.id, "shows") ? (
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
              {shows.tagline && (
                <p className="text-lg text-gray-400 italic mt-2">
                  "{shows.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="w-auto px-4 py-2 text-yellow-500 font-bold rounded-full">
                ★ {shows.vote_average ? shows.vote_average.toFixed(1) : "N/A"}
              </span>
              <span className="w-auto px-4 py-2 text-gray-200 text-sm rounded-full">
                {shows.first_air_date
                  ? new Date(shows.first_air_date).getFullYear()
                  : "TBA"}
              </span>
              <span className="w-auto px-4 py-2 text-gray-200 text-sm rounded-full">
                {shows.episode_run_time?.[0]
                  ? `${shows.episode_run_time[0]} min/episode`
                  : "N/A"}
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {shows.genres?.map((g) => (
                <span
                  key={g.id}
                  className="px-4 py-2 text-gray-300 text-xs uppercase tracking-wide rounded-full backdrop-blur-sm"
                >
                  {g.name}
                </span>
              ))}
            </div>

            {/* Languages - Fixed potential crash */}
            {shows.spoken_languages?.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {shows.spoken_languages.map((lang) => (
                  <span
                    key={lang.english_name}
                    className="px-3 py-1 text-gray-300 text-xs uppercase tracking-wide rounded-full backdrop-blur-sm"
                  >
                    {lang.english_name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold mb-4 text-gray-200 border-b border-gray-700 pb-2">
                Overview
              </h3>
              <p className="text-gray-300 leading-relaxed text-lg">
                {shows.overview || "No overview available."}
              </p>
            </div>

            <div className="flex gap-4 items-center justify-center md:justify-start">
              <TrailerButton movieKey={showKey} />
            </div>
          </div>
        </div>
      </section>

      {/* ✅ FIXED: Correct prop names for CommentBox */}
      <CastWindow />
      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />

      <CommentBox
        contentId={String(shows.id)}
        contentTitle={shows.name || shows.title}
        contentType="tv"
      />

      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />
      <ReviewWindow />
      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />
      <SimilarTvShows />
      <hr className="bg-linear-to-r from-blue-500 to-purple-500 h-px mx-4 my-8 opacity-75" />
    </>
  );
};

export default TvShowCard;
