import { useEffect, useState } from "react";
import { movieCast } from "../services/tmdbApi";
import { useParams } from "react-router-dom";

const CastWindow = () => {
  const { id } = useParams();
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const data = await movieCast(id, { signal: controller.signal });

        const sortedCast = [...(data ?? [])].sort(
          (a, b) => b.popularity - a.popularity
        );

        setCast(sortedCast);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load cast");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  if (loading) return <p>Loading cast...</p>;
  if (error) return <p>{error}</p>;
  if (!cast.length) return <p>No cast information available.</p>;
  return (
    <div
      className="flex gap-4 p-4 overflow-x-scroll snap-x snap-mandatory max-h-100 overflow-y-auto
      [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  [&::-webkit-scrollbar-thumb]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-track]:bg-[#FAFAFA]
  dark:[&::-webkit-scrollbar-thumb]:bg-[#0064E0] hover:dark:[&::-webkit-scrollbar-thumb]:bg-[#0073ff]"
    >
      {cast.map((actor) => (
        <div key={actor.cast_id} className="shrink-0 text-center snap-start">
          <img
            src={
              actor.profile_path
                ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                : "/Loader.svg"
            }
            alt={actor.name}
            className="max-w-40 h-60 object-cover rounded mx-4 flex-w"
          />
          <p className="mt-2 font-semibold">{actor.name}</p>
          <p className="max-w-40 text-sm text-gray-600">as {actor.character}</p>
        </div>
      ))}
    </div>
  );
};

export default CastWindow;
