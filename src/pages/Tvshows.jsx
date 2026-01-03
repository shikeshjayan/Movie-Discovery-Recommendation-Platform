import { useEffect, useState } from "react"
import { allTvshows } from "../services/tmdbApi"
import { Link } from "react-router-dom"
import Banner from "../tvshows/Banner"
import GenreBar from "../tvshows/GenreBar"
const Movies = () => {
  const [tvShows, setTvShows] = useState([])

  useEffect(() => {
    allTvshows().then(setTvShows)
  }, [])
  
  return (
    <section className='shows-page py-4 flex flex-col gap-4'>
      <Banner />
      <hr className="text-neutral-300" />
      <GenreBar />
      <h4 className='popular-movies text-3xl'>Tv Shows</h4>
      {/* Mapping Array of Popular_Movies_List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 justify-items-center">
        {tvShows.slice(0, 16).map((shows) => {
          return (
            <Link
              key={shows.id}
              to={`/tvshow/${shows.id}`}
              className="no-underline block"
            >
              <div className="show-case">
                <img
                  src={`https://image.tmdb.org/t/p/w342${shows.poster_path}`}
                  alt={shows.original_name || shows.original_title}
                  className="w-50 h-75 rounded shadow-md object-cover"
                />
                <h5 className="w-50 px-2 px-auto">{shows.name || shows.original_name || shows.title}</h5>
              </div>
            </Link>
          )
        })}
      </div>

    </section>
  )
}

export default Movies