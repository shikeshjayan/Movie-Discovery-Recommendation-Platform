import { useEffect, useRef } from "react";
import MediaSkeleton from "../ui/MediaSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeProvider";

/**
 * UniversalCarousel Component
 * ---------------------------
 * A reusable horizontal carousel for any type of media (movies, shows, etc.).
 *
 * Features:
 * - Displays a title above the carousel
 * - Shows skeleton loaders while data is loading
 * - Renders items using a custom `renderItem` function
 * - Auto-scrolls horizontally when enabled
 * - Pauses auto-scroll on hover
 * - Smooth scroll behavior with hidden scrollbar
 *
 * Props:
 * - `title` (string): Optional title displayed above the carousel
 * - `items` (array): Array of items to display (e.g., movies, shows)
 * - `loading` (boolean): If true, shows skeleton loaders instead of items
 * - `renderItem` (function): Function that takes an item and returns a JSX element
 * - `skeletonCount` (number): Number of skeleton items to show when loading (default: 8)
 * - `autoScroll` (boolean): Whether to auto-scroll the carousel (default: true)
 * - `scrollSpeed` (number): Delay in ms between scroll steps (lower = faster)
 */
const UniversalCarousel = ({
  title,
  items = [],
  loading = false,
  renderItem,
  skeletonCount = 8,
  autoScroll = true,
  scrollSpeed = 30,
}) => {
  const { theme } = useContext(ThemeContext);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  /* ------------------------- Auto Scroll Logic ------------------------- */
  // Effect to handle auto-scrolling behavior
  useEffect(() => {
    // If auto-scroll is disabled or we're in loading state, do nothing
    if (!autoScroll || loading) return;

    // Get the scrollable container from the ref
    const container = scrollRef.current;
    if (!container) return;

    // Function to start auto-scrolling
    const start = () => {
      // Set an interval that moves the scroll position by 1px every `scrollSpeed` ms
      intervalRef.current = setInterval(() => {
        container.scrollLeft += 1;
      }, scrollSpeed);
    };

    // Function to stop auto-scrolling
    const stop = () => {
      // Clear the interval and reset the ref
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };

    // Start auto-scrolling when the effect runs
    start();

    // Pause auto-scroll when mouse enters the carousel
    container.addEventListener("mouseenter", stop);
    // Resume auto-scroll when mouse leaves the carousel
    container.addEventListener("mouseleave", start);

    // Cleanup: clear interval and remove event listeners on unmount
    return () => {
      stop();
      container.removeEventListener("mouseenter", stop);
      container.removeEventListener("mouseleave", start);
    };
  }, [autoScroll, loading, scrollSpeed]); // Re-run effect when these values change

  // If there are no items and we're not loading, render nothing
  if (!items.length && !loading) return null;

  return (
    <section className="flex flex-col gap-4 relative group">
      {/* Optional title */}
      {title && (
        <h4 className="my-2 pl-4 md:text-3xl font-semibold">{title}</h4>
      )}

      {/* Navigation Arrows */}
      {!loading && items.length > 0 && (
        <>
          <button
            onClick={() => scroll("left")}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
              ${theme === "dark" ? "bg-[#312F2C] text-[#ECF0FF] hover:bg-[#3d3a37]" : "bg-white text-[#312F2C] hover:bg-gray-100"}
              hidden md:block`}
            aria-label="Scroll left">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity
              ${theme === "dark" ? "bg-[#312F2C] text-[#ECF0FF] hover:bg-[#3d3a37]" : "bg-white text-[#312F2C] hover:bg-gray-100"}
              hidden md:block`}
            aria-label="Scroll right">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 px-4 scroll-smooth
          [&::-webkit-scrollbar]:hidden"
      >
        {/* Skeleton loaders shown while loading */}
        {loading &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <MediaSkeleton key={i} />
          ))}

        {/* Render actual items when not loading */}
        {!loading && items.map(renderItem)}
      </div>
    </section>
  );
};

export default UniversalCarousel;
