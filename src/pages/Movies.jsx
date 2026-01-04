import { useEffect, useState } from "react"
import { allMovies, fetchMoviesByGenre } from "../services/tmdbApi"
import { Link } from "react-router-dom"
import Banner from "../movies/Banner"
import GenreBar from "../movies/GenreBar"
import ImageWithLoader from "../ui/ImageWithLoader"
const Movies = () => {
  const [movies, setmovies] = useState([])
  const [page, setPage] = useState(1)

  useEffect(() => {
    allMovies(page).then(setmovies)
  }, [page])

  const loadTrending = async () => {
    const data = await allMovies()
    setmovies(data)
  }


  const handleGenreChange = async (id) => {
    if (id === "trending") {
      await loadTrending()
    } else {
      const data = await fetchMoviesByGenre(id)
      setmovies(data)
    }
  }


  return (
    <section className='home-page py-4 flex flex-col gap-4'>
      <Banner />
      <GenreBar setGenre={handleGenreChange} />
      <h4 className='popular-movies text-3xl'>Movies</h4>
      {/* Mapping Array of Popular_Movies_List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 justify-items-center">
        {movies.slice(0, 16).map((movie) => {
          if (!movie.poster_path) return null;
          return (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="no-underline block"
            >
              <div className="movie-case">
                <ImageWithLoader
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.original_title || movie.name}
                  className="w-50 h-75 rounded shadow-md object-cover"
                  onError={(e) => { e.target.src = "/Loader.gif" }}
                />
                <h5 className="w-50 px-2 px-auto">{movie.name}</h5>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="w-full flex justify-center">
        <div className="flex gap-1">
          <button disabled={page === 1} onClick={() => setPage(prev => prev - 1)}
            className={`${page === 1 ? "opacity-20" : "btn"} w-24 border p-2 cursor-pointer`}>Prev</button>
          <button onClick={() => setPage(prev => prev + 1)} className="w-24 border p-2 cursor-pointer">Next</button>
        </div>
      </div>
    </section>
  )
}

export default Movies