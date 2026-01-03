import { useEffect, useState } from "react"
import { allMovies } from "../services/tmdbApi"
import { Link } from "react-router-dom"
import Banner from "../movies/Banner"
import GenreBar from "../movies/GenreBar"
const Movies = () => {
  const [movies, setmovies] = useState([])

  useEffect(() => {
    allMovies().then(setmovies)
  }, [])
  console.log("all movies:", movies);

  return (
    <section className='home-page py-4 flex flex-col gap-4'>
      <Banner />
      <hr className="text-neutral-300" />
      <GenreBar />
      <h4 className='popular-movies text-3xl'>Movies</h4>
      {/* Mapping Array of Popular_Movies_List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4 justify-items-center">
        {movies.slice(0, 16).map((movie) => {
          return (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              className="no-underline block"
            >
              <div className="movie-case">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.original_title || movie.name}
                  className="w-50 h-75 rounded shadow-md object-cover"
                />
                <h5 className="w-50 px-2 px-auto">{movie.name}</h5>
              </div>
            </Link>
          )
        })}
      </div>

    </section>
  )
}

export default Movies