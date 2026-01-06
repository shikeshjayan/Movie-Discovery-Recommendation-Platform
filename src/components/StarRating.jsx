import { faStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const StarRating = ({ value, max = 5 }) => {
  const fullStars = Math.floor(value);

  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, index) => (
        <span key={index}>
          {index < fullStars ? (
            <FontAwesomeIcon icon={faStar} style={{ color: "#FFD43B" }} />
          ) : (
            <FontAwesomeIcon icon={faStar} />
          )}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
