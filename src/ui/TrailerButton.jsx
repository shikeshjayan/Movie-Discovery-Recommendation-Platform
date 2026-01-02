import { useState } from "react";
import VideoPlayer from "../ui/VideoPlayer";

const TrailerButton = ({ movieKey, tvKey }) => {

    console.log(("Keys", tvKey));

    const [open, setOpen] = useState(false);

    if (!movieKey && !tvKey) {
        return (
            <button
                disabled
                className="bg-gray-600 text-white px-6 py-2 h-10 rounded mt-4 cursor-not-allowed"
            >
                Trailer Not Available
            </button>
        );
    }


    return (
        <>
            {/* Play Button */}
            <button
                onClick={() => setOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 h-10 rounded mt-4 hover:bg-blue-700 transition"
            >
                ▶ Watch Trailer
            </button>

            {/* Modal */}
            {open && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                    <div className="w-full max-w-5xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute -top-10 right-0 text-white text-xl hover:text-red-500"
                        >
                            ✕ Close
                        </button>

                        {/* Video */}
                        <VideoPlayer videoKey={movieKey || tvKey} />
                    </div>
                </div>
            )}
        </>
    )
}

export default TrailerButton