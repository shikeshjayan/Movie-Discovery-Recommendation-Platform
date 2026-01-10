import React from "react";
import ImageWithLoader from "./ImageWithLoader";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const WatchLaterCard = ({ movie, onClick, onRemove }) => {
  return (
    <div className="watch-later-card relative group w-50 cursor-pointer">
      <ImageWithLoader
        src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
        alt={movie.title || movie.name}
        className="w-50 h-75 rounded shadow-md object-cover"
        onClick={onClick} // optional: navigate to movie details
      />

      {/* Remove single movie */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // prevent navigation
          onRemove && onRemove();
        }}
        className="absolute top-2 right-2 text-red-600 px-2 py-1 rounded text-sm z-10"
      >
        <FontAwesomeIcon icon={faXmark} size="sm" />
      </button>

      {/* Rating badge */}
      <span className="absolute top-2 right-2 bg-yellow-500 text-black font-bold text-sm px-3 py-1 rounded opacity-0 group-hover:opacity-100 z-10">
        ★ {movie.vote_average?.toFixed(1) ?? "N/A"}
      </span>

      {/* Title */}
      <h5 className="w-50 px-2 text-center mt-2">
        {movie.title || movie.name}
      </h5>
    </div>
  );
};

export default WatchLaterCard;
