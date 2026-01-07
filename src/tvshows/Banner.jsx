import { useEffect, useState } from "react";
import { airingShows } from "../services/tmdbApi";
import ImageWithLoader from "../ui/ImageWithLoader"

const Banner = () => {
  const [airingShowsList, setAiringShowsList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch movies
  useEffect(() => {
    airingShows().then(setAiringShowsList);
  }, []);


  useEffect(() => {
    if (airingShowsList.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === airingShowsList.length - 1 ? 0 : prev + 1
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [airingShowsList]);

  if (airingShowsList.length === 0) return null;

  const shows = airingShowsList[currentIndex];

  if (!shows || !shows.backdrop_path) return null;

  return (
    <section className="relative w-full h-[80vh] overflow-hidden">
      {/* Image */}
      <ImageWithLoader
        key={shows.id}
        src={`https://image.tmdb.org/t/p/original${shows.backdrop_path}`}
        alt={shows.title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Black fog */}
      <div
        className="absolute bottom-0 left-0 w-full h-[45%]
             bg-black/40 backdrop-blur-lg
             mask-[linear-gradient(to_top,black_70%,transparent_100%)]
             [-webkit-mask-image:linear-gradient(to_top,black_70%,transparent_100%)]">
      </div>

      {/* Text */}
      <div className="relative z-10 bottom-[50%] left-6 max-w-3xl">
        <h2 className="text-white text-7xl font-bold">
          {shows.original_title || shows.name}
        </h2>

        <p className="text-yellow-500 text-sm font-bold">
          {shows.vote_average.toFixed(1)} / 10
        </p>

        <p className="text-white text-sm italic font-bold">
          {shows.original_language}
        </p>

        <p className="text-white text-lg font-light leading-relaxed">
          {shows.overview}
        </p>
      </div>
    </section>
  );
};

export default Banner;
