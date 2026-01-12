import { useState } from "react";

/**
 * BlurImage Component
 * -------------------
 * A progressive image loader that shows a low-quality blurred placeholder first,
 * then smoothly fades in the full-resolution image.
 *
 * Features:
 * - Improves perceived performance (user sees something immediately)
 * - Uses a smaller, blurred version as placeholder
 * - Smooth fade transition between placeholder and full image
 * - Handles missing `src` gracefully
 * - Optimized with `loading="lazy"` and `decoding="async"`
 *
 * Props:
 * - `src` (string): Full image URL (e.g., TMDB `w342` path)
 * - `alt` (string): Alt text for accessibility
 * - `className` (string, optional): Additional Tailwind classes for the container
 */
const BlurImage = ({ src, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  // If no src is provided, render nothing
  if (!src) return null;

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low-quality blurred placeholder */}
      {/* - Uses a smaller size (w92) for fast loading */}
      {/* - Blurred and scaled slightly up for a nice "blur-up" effect */}
      {/* - Hidden once the main image loads */}
      <img
        src={src.replace("/w342", "/w92")}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full object-cover
          blur-lg scale-110 transition-opacity duration-500
          ${loaded ? "opacity-0" : "opacity-100"}`}
      />

      {/* Full-quality image */}
      {/* - Loads lazily and asynchronously */}
      {/* - Fades in once loaded */}
      {/* - Takes up the full container */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500
          ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default BlurImage;
