import { useEffect, useState } from "react";
import { UpcomingMovies } from "../services/tmdbApi";
import ImageWithLoader from "../ui/ImageWithLoader"

const Banner = () => {
    const [upcomingMovieList, setUpcomingMovieList] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch movies
    useEffect(() => {
        UpcomingMovies().then(setUpcomingMovieList);
    }, []);


    useEffect(() => {
        if (upcomingMovieList.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev === upcomingMovieList.length - 1 ? 0 : prev + 1
            );
        }, 6000);

        return () => clearInterval(interval);
    }, [upcomingMovieList]);

    if (upcomingMovieList.length === 0) return null;

    const movie = upcomingMovieList[currentIndex];

  if (!movie || !movie.backdrop_path) return null;

    return (
        <section className="relative w-full h-[80vh] overflow-hidden">
            {/* Image */}
            <ImageWithLoader
                key={movie.id}
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                className="absolute inset-0 w-full h-full object-cover fadeIn"
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
                <h2 className="text-white lg:text-7xl font-bold">
                    {movie.original_title || movie.title}
                </h2>

                <p className="text-yellow-500 text-sm font-bold">
                    {movie.vote_average.toFixed(1)} / 10
                </p>

                <p className="text-white text-sm italic font-bold">
                    {movie.original_language}
                </p>

                <p className="text-white text-sm md:text-md lg:text-lg font-light leading-relaxed px-10">
                    {movie.overview}
                </p>
            </div>
        </section>
    );
};


export default Banner;
