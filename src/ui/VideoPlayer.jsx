import { motion } from "framer-motion";
import YouTube from "react-youtube";

/**
 * VideoPlayer Component
 * ---------------------
 * A responsive YouTube video player with fade-in animation.
 *
 * Features:
 * - Only renders when `videoKey` is provided
 * - Responsive container with aspect ratio (16:9)
 * - Full-width YouTube iframe inside a rounded black box
 * - Fade-in animation when mounted
 * - Safe handling of player events (ready, state change)
 *
 * Props:
 * - `videoKey` (string): YouTube video ID (e.g., "dQw4w9WgXcQ")
 */
const VideoPlayer = ({ videoKey }) => {
  // Don’t render anything if no video key is provided
  if (!videoKey) return null;

  // YouTube player options
  const opts = {
    width: "100%",
    height: "100%",
    playerVars: {
      autoplay: 0, // Don’t autoplay by default
      controls: 1, // Show player controls
    },
  };

  // Called when the YouTube player is ready
  const onReady = (event) => {
    console.log("YouTube player is ready", event.target);
  };

  // Called when the player’s state changes (playing, paused, ended, etc.)
  const onStateChange = (event) => {
    console.log("YouTube player state changed:", event.data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full sm:max-w-90 md:max-w-3xl lg:max-w-5xl mx-auto mt-10"
    >
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <YouTube
          videoId={videoKey}
          className="absolute inset-0 w-full h-full"
          iframeClassName="w-full h-full"
          opts={opts}
          onReady={onReady}
          onStateChange={onStateChange}
        />
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
