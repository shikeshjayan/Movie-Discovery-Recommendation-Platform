import { useEffect, useState } from "react";
import { showsDetails, showVideos } from "../services/tmdbApi";
import { useNavigate, useParams } from "react-router-dom";
import ImageWithLoader from "../ui/ImageWithLoader"
import TrailerButton from "../ui/TrailerButton";
import MovieCardSkeleton from "../ui/MovieCardSkeleton";
import SimilarTvShows from "./SimilarTvShows";

const MovieCard = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [shows, setShows] = useState(null);
    const [showKey, setShowKey] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            const data = await showsDetails(id);
            setShows(data);
            setLoading(false);
        };
        fetchMovie();
    }, [id]);

    useEffect(() => {

        const fetchVideos = async () => {
            const data = await showVideos(id);
            setShowKey(data);
        };
        fetchVideos()
    }, [id])


    if (loading || !shows) {
        return <MovieCardSkeleton />;
    }

    if (!showKey) {
        return <div className="h-screen flex items-center justify-center text-white text-xl">Loading...</div>;
    }

    const backdropUrl = shows.backdrop_path
        ? `https://image.tmdb.org/t/p/original${shows.backdrop_path}`
        : "/fallback-backdrop.jpg";

    const posterUrl = shows.poster_path
        ? `https://image.tmdb.org/t/p/w500${shows.poster_path}`
        : "/fallback-poster.jpg";






    return (
        <>
            <section className="tv_show-card relative w-full min-h-[90vh] text-white bg-gray-900 overflow-hidden">

                <button
                    onClick={() => navigate("/movies")}
                    className="text-white py-2 rounded absolute z-20 right-4 top-4 hover:text-blue-600"
                >
                    Close
                </button>

                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-40 blur-sm"
                    style={{ backgroundImage: `url(${backdropUrl})` }}
                ></div>


                <div className="absolute inset-0"></div>


                <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row items-center md:items-start gap-10">


                    <div className="shrink-0 w-64 md:w-80 lg:w-96 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800/50">
                        <ImageWithLoader
                            src={posterUrl}
                            alt={shows.title}
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    <div className="flex-1 flex flex-col gap-4 space-y-6 text-center md:text-left">


                        <div>
                            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                                {shows.title || shows.name}
                            </h1>
                            {shows.tagline && (
                                <p className="text-lg text-gray-400 italic mt-2">"{shows.tagline}"</p>
                            )}
                        </div>

                        <div style={{ padding: "5px" }} className="flex flex-wrap justify-center md:justify-start gap-3">
                            <span style={{ padding: "5px" }} className="w-14 px-3 py-1 bg-yellow-500 text-black font-bold rounded text-sm">
                                ★ {shows.vote_average ? shows.vote_average.toFixed(1) : "N/A"}
                            </span>
                            <span style={{ padding: "5px" }} className="w-14 px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {shows.release_date ? new Date(shows.release_date).getFullYear() : ""}
                            </span>
                            <span style={{ padding: "5px" }} className="w-20 text-center px-3 py-1 bg-gray-700 text-gray-200 rounded text-sm">
                                {shows.runtime} min
                            </span>
                        </div>

                        {/* Genres */}
                        <div style={{ padding: "5px" }} className="flex flex-wrap justify-center text-center md:justify-start gap-2">
                            {shows.genres?.map((g) => (
                                <span key={g.id} className="w-25 px-3 py-1 border border-gray-600 text-gray-300 rounded text-xs uppercase tracking-wide">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        {/* Overview */}
                        <div className="max-w-2xl">
                            <h3 className="text-xl font-semibold mb-2 text-gray-200">Overview</h3>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {shows.overview}
                            </p>
                        </div>

                        <TrailerButton movieKey={showKey} />

                    </div>
                </div>
            </section>
            <SimilarTvShows />
        </>
    );
};

export default MovieCard;
