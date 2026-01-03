import { useEffect, useState } from "react"
import { tvShowGenre } from "../services/tmdbApi"

const GenreBar = () => {
    const [genre, setGenre] = useState([])

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const data = await tvShowGenre()
                setGenre(data)
            } catch (err) {
                console.error("Failed to fetch genres", err)
            }
        }
        fetchGenres()
    }, [])
    
    return (
        <div className="genre bg-amber-400 w-full h-20 flex gap-8 justify-around items-center">
            {genre.map((g) => {
                return (
                    <span key={g.id}>{g.name}</span>
                )
            })}
        </div>
    )
}

export default GenreBar