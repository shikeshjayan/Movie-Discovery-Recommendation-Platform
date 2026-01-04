import { useEffect, useState } from "react"
import { popularMovies } from "../services/tmdbApi"
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;
const INTERVAL_TIME = 30000;

const Moviecase = () => {
    const [popularMoviesList, setPopularMoviesList] = useState([])
    const [pageIndex, setPageIndex] = useState(0)


    useEffect(() => {
        popularMovies().then(setPopularMoviesList)

    }, [])

    // Auto-rotate pages
    useEffect(() => {
        if (popularMoviesList.length === 0) return;

        const totalPages = Math.ceil(
            popularMoviesList.length / ITEMS_PER_PAGE
        );

        const interval = setInterval(() => {
            setPageIndex((prev) => (prev + 1) % totalPages);
        }, INTERVAL_TIME);

        return () => clearInterval(interval);
    }, [popularMoviesList]);

    const start = pageIndex * ITEMS_PER_PAGE;
    const currentMovies = popularMoviesList.slice(
        start,
        start + ITEMS_PER_PAGE
    );



    return (
        <section className="flex flex-col gap-4">
            <h4 className="popular-movies text-3xl">Popular Movies</h4>

            <div className="grid gap-4 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8">
                {currentMovies.slice(0, 8).map((movie) => (
                    <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        className="group relative no-underline"
                    >
                        {/* Card */}
                        <div className="movie-case relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                alt={movie.title}
                                className="w-50 h-75 rounded shadow-md"
                            />

                            {/* Rating badge */}
                            <span
                                className="absolute bottom-2 left-2
                       bg-yellow-500 text-black font-bold text-sm
                       px-3 py-1 rounded
                       opacity-0 group-hover:opacity-100
                       transition-opacity duration-300"
                            >
                                ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
                            </span>
                            <button onClick={() => {
                                console.log("Wishlisted");
                            }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100
                       transition-opacity duration-300">❤︎</button>
                        </div>

                        {/* Title */}
                        <h5 className="mt-2 w-50 text-center">
                            {movie.title}
                        </h5>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default Moviecase