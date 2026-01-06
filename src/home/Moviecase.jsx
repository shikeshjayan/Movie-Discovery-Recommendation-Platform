import { useEffect, useState } from "react"
import { popularMovies } from "../services/tmdbApi"
import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";

const ITEMS_PER_PAGE = 8;
const INTERVAL_TIME = 30000;

const Moviecase = () => {
    const [popularMoviesList, setPopularMoviesList] = useState([])
    const [pageIndex, setPageIndex] = useState(0)

    const { addToHistory } = useHistory()


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

                        onClick={() =>
                            addToHistory({
                                id: movie.id,
                                title: movie.title,
                                poster_path: movie.poster_path,
                                vote_average: movie.vote_average,
                                type: "movie",
                            })
                        }

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
                            }} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100
                       transition-opacity duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" /></svg>
                            </button>
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