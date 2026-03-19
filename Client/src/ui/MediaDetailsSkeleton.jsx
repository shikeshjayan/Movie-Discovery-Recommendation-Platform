import { Navigate, useNavigate } from "react-router-dom";

/**
 * MediaDetailsSkeleton Component
 * ------------------------------
 * A loading skeleton for the movie/TV show details page.
 * - Shows a full-screen animated placeholder while data is loading
 * - Includes a close button to go back
 * - Mimics the layout of the real details page (poster + text blocks)
 */
const MediaDetailsSkeleton = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-[90vh] bg-gray-900 p-10 animate-pulse overflow-hidden">
      {/* Close button */}
      <button
        onClick={() => navigate(-1)}
        className="text-white py-2 rounded fixed z-20 right-6 top-16 hover:text-blue-600"
      >
        Close
      </button>

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gray-800 opacity-40"></div>

      {/* Content area */}
      <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
        {/* Poster skeleton */}
        <div className="w-64 md:w-80 lg:w-96 h-112.5 bg-gray-700 rounded-xl shadow-lg"></div>

        {/* Text content skeleton */}
        <div className="flex-1 space-y-5">
          {/* Title */}
          <div className="h-10 w-3/4 bg-gray-700 rounded"></div>
          {/* Tagline */}
          <div className="h-5 w-1/3 bg-gray-700 rounded"></div>

          {/* Rating, year, runtime */}
          <div className="flex gap-3 mt-4">
            <div className="h-6 w-14 bg-gray-700 rounded"></div>
            <div className="h-6 w-14 bg-gray-700 rounded"></div>
            <div className="h-6 w-20 bg-gray-700 rounded"></div>
          </div>

          {/* Overview */}
          <div className="space-y-3 mt-6">
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-11/12 bg-gray-700 rounded"></div>
            <div className="h-4 w-10/12 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailsSkeleton;
