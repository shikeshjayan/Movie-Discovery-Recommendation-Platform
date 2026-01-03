import { useEffect, useState } from "react";
import { airingShows } from "../services/tmdbApi";

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
    }, 3000);

    return () => clearInterval(interval);
  }, [airingShowsList]);

  if (airingShowsList.length === 0) return null;

  const shows = airingShowsList[currentIndex];
  
  return (
    <section className="banner-page w-full h-[80vh] relative overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original${shows.backdrop_path}`}
        alt={shows.title}
        className="w-full h-full object-cover"
      />
      <div className="backdrop-image absolute bottom-[30%] left-6 w-200 h-100 bg-black/40 backdrop-blur-lg">
        <h2 className="flex flex-col text-white text-5xl font-bold rounded-md">
          {shows.original_title || shows.name}
        </h2>
        <p className="text-yellow-500 text-lg font-bold rounded-md">
          {shows.vote_average} / 10
        </p>
        <p className="text-white text-lg font-bold rounded-md">
          Language: {shows.original_language}
        </p>
        <p className="text-white text-1xl font-bold rounded-md">
          {shows.overview}
        </p>
      </div>
    </section>
  );
};

export default Banner;
