import { useEffect } from "react";
import { useState } from "react";
import { getRecommendationsService } from "../services/axiosApi";
import { isAuthenticated } from "../context/AuthContext";

const RecommendedMovies = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [recType, setRecType] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await getRecommendationsService(recType);
        setRecommendations(res.data);
      } catch (err) {
        console.log("Error fetching recommendations", err);
      }
    };
    if (isAuthenticated) fetchRecs();
  }, [isAuthenticated, recType]);

  return <div className="flex gap-2 mb-4">{recommendations}</div>;
};

export default RecommendedMovies;
