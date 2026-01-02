import { useState } from "react";

const ImageWithLoader = ({ src, alt }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-800">
            {!loaded && (
                <div className="absolute inset-0 animate-pulse
                    bg-linear-to-r from-gray-700 via-gray-600 to-gray-700" />
            )}

            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-700 rounded-lg shadow-lg ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
};

export default ImageWithLoader;
