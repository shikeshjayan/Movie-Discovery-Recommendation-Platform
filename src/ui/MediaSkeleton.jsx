/**
 * MediaSkeleton - For Home
 * --------------------------------------------------
 * Generic skeleton loader for posters/cards
 * - Used while fetching API data
 * - Matches movie & TV card layout
 */
const MediaSkeleton = ({ count = 1 }) => {
  return Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="shrink-0 w-48 animate-pulse"
      aria-hidden="true"
    >
      <div className="w-full h-67.5 bg-gray-300 dark:bg-gray-700 rounded" />
      <div className="mt-2 h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mx-auto" />
    </div>
  ));
};

export default MediaSkeleton;
