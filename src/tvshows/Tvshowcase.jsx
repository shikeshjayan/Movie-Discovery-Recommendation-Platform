import { useEffect, useState } from "react"
import { popularTVShows } from "../services/tmdbApi"
import { Link } from "react-router-dom";

const ITEMS_PER_PAGE = 8;
const INTERVAL_TIME = 30000;

const Tvshowcase = () => {
    const [popularShowsList, setPopularShowsList] = useState([])
    const [pageIndex, setPageIndex] = useState(0)


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
        <section className='flex flex-col gap-4'>
            <h4 className='popular-shows text-3xl'>Popular TV Shows</h4>
            {/* Mapping Array of Popular_Movies_List */}
            <div className="grid grid-cols-8 justify-items-center">
                {currentShows.slice(0, 8).map((shows) => {
                    return (
                        <div key={shows.id}>
                            <Link
                                key={shows.id}
                                to={`/tvshow/${shows.id}`}
                                className="no-underline block"
                            >
                                <div className="show-case">
                                    <img src={`https://image.tmdb.org/t/p/w342${shows.poster_path}`} alt={shows.title} className="w-50 h-75 rounded shadow-md hover:scale-95" />
                                    <h5 className="w-50 px-2 px-auto">{shows.original_name}</h5>
                                </div>
                            </Link>
                        </div>
                    )
                })}
            </div>

        </section>
    )
}

export default Tvshowcase