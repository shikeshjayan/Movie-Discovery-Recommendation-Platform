import { useEffect, useState } from "react"
import { popularTVShows } from "../services/tmdbApi"
import { Link } from "react-router-dom";
import { useHistory } from "../context/HistoryContext";

const ITEMS_PER_PAGE = 8;
const INTERVAL_TIME = 30000;

const Tvshowcase = () => {
    const [popularShowsList, setPopularShowsList] = useState([])
    const [pageIndex, setPageIndex] = useState(0)

    const { addToHistory } = useHistory()



    // Auto-rotate pages
    useEffect(() => {
        if (popularShowsList.length === 0) return;

        const totalPages = Math.ceil(
            popularShowsList.length / ITEMS_PER_PAGE
        );

        const interval = setInterval(() => {
            setPageIndex((prev) => (prev + 1) % totalPages);
        }, INTERVAL_TIME);

        return () => clearInterval(interval);
    }, [popularShowsList]);

    const start = pageIndex * ITEMS_PER_PAGE;
    const currentShows = popularShowsList.slice(
        start,
        start + ITEMS_PER_PAGE
    );


    useEffect(() => {
        popularTVShows().then(setPopularShowsList)

    }, [])
    return (
        <section className="flex flex-col gap-4">
            <h4 className="popular-movies text-3xl">Popular TV Shows</h4>

            <div className="grid gap-4 justify-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-8">
                {currentShows.slice(0, 8).map((show) => (
                    <Link
                        key={show.id}
                        to={`/movie/${show.id}`}

                        onClick={() =>
                            addToHistory({
                                id: show.id,
                                title: show.title,
                                poster_path: show.poster_path,
                                vote_average: show.vote_average,
                                type: "show",
                            })
                        }


                        className="group relative no-underline"
                    >
                        {/* Card */}
                        <div className="movie-case relative">
                            <img
                                src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                                alt={show.title || show.name}
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
                                ★ {show.vote_average?.toFixed(1) ?? "N/A"}
                            </span>
                            <button onClick={() => {
                                console.log("Wishlisted");
                            }} className="absolute top-1 right-1 opacity-0 group-hover:opacity-100
                       transition-opacity duration-300">❤︎</button>
                        </div>

                        {/* Title */}
                        <h5 className="mt-2 w-50 text-center">
                            {show.title || show.name}
                        </h5>
                    </Link>
                ))}
            </div>
        </section>
    )
}

export default Tvshowcase