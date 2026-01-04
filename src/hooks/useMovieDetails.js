import { useEffect, useState } from "react";
import { movieDetails, movieVideos } from "../services/tmdbApi";
const useMovieDetails = (movieId) => {
    const [movie, setMovie] = useState(null);
    const [movieKey, setMovieKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!movieId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [details, videos] = await Promise.all([
                    movieDetails(movieId),
                    movieVideos(movieId),
                ]);

                setMovie(details);
                setMovieKey(videos);
            } catch (error) {
                console.error("Failed to fetch movie data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);
    return { movie, movieKey, loading };
}

export default useMovieDetails