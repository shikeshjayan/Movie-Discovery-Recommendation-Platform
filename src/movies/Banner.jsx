import { useEffect, useState } from "react";
import { nowPlayingMovies } from "../services/tmdbApi";

const Banner = () => {
  const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch movies
  useEffect(() => {
    nowPlayingMovies().then(setNowPlayingMoviesList);
  }, []);


  useEffect(() => {
    if (nowPlayingMovies.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === nowPlayingMovies.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [nowPlayingMoviesList]);

  if (nowPlayingMoviesList.length === 0) return null;

  const movie = nowPlayingMoviesList[currentIndex];
console.log("now playing", movie);

  return (
    <section className="banner-page w-full h-[80vh] relative overflow-hidden">
      <img
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title}
        className="w-full h-full object-cover"
      />
      <div className="backdrop-image absolute bottom-[30%] left-6 w-200 h-100 bg-black/40 backdrop-blur-lg">
        <h2 className="flex flex-col text-white text-5xl font-bold rounded-md">
          {movie.original_title || movie.title}
        </h2>
        <p className="text-yellow-500 text-lg font-bold rounded-md">
          {movie.vote_average} / 10
        </p>
        <p className="text-white text-lg font-bold rounded-md">
          Language: {movie.original_language}
        </p>
        <p className="text-white text-1xl font-bold rounded-md">
          {movie.overview}
        </p>
      </div>
    </section>
  );
};

export default Banner;
