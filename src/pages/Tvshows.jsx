import { useEffect, useState } from "react"
import { allTvshows, fetchTvShowsByGenre } from "../services/tmdbApi"
import { Link } from "react-router-dom"
import Banner from "../tvshows/Banner"
import GenreBar from "../tvshows/GenreBar"
import ImageWithLoader from "../ui/ImageWithLoader"
import { useHistory } from "../context/HistoryContext"

const Movies = () => {
  const [tvShows, setTvShows] = useState([])
  const [page, setPage] = useState(1)
  const { addToHistory } = useHistory()

  useEffect(() => {
    allTvshows(page).then(setTvShows)
  }, [page])

  const loadTrending = async () => {
    const data = await allTvshows()
    setTvShows(data)
  }

  const handleGenreChange = async (id) => {
    if (id === "trending") {
      await loadTrending()
    } else {
      const data = await fetchTvShowsByGenre(id)
      setTvShows(data)
    }
  }

  return (
    <section className='shows-page py-4 flex flex-col gap-4'>
      <Banner />
      <GenreBar setGenre={handleGenreChange} />
      <h4 className='popular-movies text-3xl'>Tv Shows</h4>
      {/* Mapping Array of Popular_Movies_List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 justify-items-center">
        {tvShows.slice(0, 16).map((shows) => {
          if (!shows.poster_path) return null;
          return (
            <Link
              key={shows.id}

              onClick={() =>
                addToHistory({
                  id: shows.id,
                  title: shows.title,
                  poster_path: shows.poster_path,
                  vote_average: shows.vote_average,
                  type: "shows",
                })
              }

              to={`/tvshow/${shows.id}`}
              className="no-underline block"
            >
              <div className="show-case">
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${shows.poster_path}`}
                  alt={shows.original_name || shows.original_title}
                  className="w-50 h-75 rounded shadow-md object-cover"
                  onError={(e) => { e.target.src = "/Loader.svg" }}
                />
                <h5 className="w-50 px-2 px-auto">{shows.name || shows.original_name || shows.title}</h5>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="w-full flex justify-center">
        <div className="flex gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => prev - 1)}
            className={`${page === 1 ? "opacity-20" : "btn"} w-24 border p-2 cursor-pointer`}
          >
            Previous
          </button>
          <button onClick={() => setPage(prev => prev + 1)} className="w-24 border p-2 cursor-pointer">Next</button>
        </div>
      </div>
    </section>
  )
}

export default Movies