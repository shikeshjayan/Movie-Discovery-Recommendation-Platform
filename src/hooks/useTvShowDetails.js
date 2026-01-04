import { useEffect, useState } from "react";
import { showsDetails, showVideos } from "../services/tmdbApi";
const useTvShowDetails = (showId) => {
     const [shows, setShows] = useState(null);
    const [showKey, setShowKey] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!showId) return;

        const fetchData = async () => {
            try {
                setLoading(true);

                const [details, videos] = await Promise.all([
                    showsDetails(showId),
                    showVideos(showId),
                ]);

                setShows(details);
                setShowKey(videos);
            } catch (error) {
                console.error("Failed to fetch movie data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showId]);
    return { shows, showKey, loading };
}

export default useTvShowDetails