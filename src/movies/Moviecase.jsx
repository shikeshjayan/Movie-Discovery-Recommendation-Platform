import { useEffect, useState } from "react"
import { popularMovies } from "../services/tmdbApi"

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
        <section className='flex flex-col gap-4'>
            <h4 className='popular-movies text-3xl'>Popular Movies</h4>
            {/* Mapping Array of Popular_Movies_List */}
            <div className="grid sm:grid-cols-1 md:grid-cols-6 lg:grid-cols-8 justify-items-center">
                {currentMovies.slice(0, 8).map((movie) => {
                    return (
                        <div key={movie.id}>
                            <div className="movie-case">
                                <img src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`} alt={movie.title} className="w-50 h-75 rounded shadow-md" />
                                <h5 className="w-50 px-2 px-auto">{movie.title}</h5>
                            </div>
                        </div>
                    )
                })}
            </div>

        </section>
    )
}

export default Moviecase