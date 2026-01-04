import { Navigate, useNavigate } from "react-router-dom";

const MovieCardSkeleton = () => {
    const navigate = useNavigate()

    return (
        <div className="relative w-full min-h-[90vh] bg-gray-900 p-10 animate-pulse overflow-hidden">
            <button
                onClick={() => navigate(-1)}
                className="text-white py-2 rounded fixed z-20 right-6 top-30 hover:text-blue-600"
            >
                Close
            </button>
            {/* Background */}
            <div className="absolute inset-0 bg-gray-800 opacity-40"></div>

            <div className="relative z-10 container mx-auto px-6 py-16 flex flex-col md:flex-row gap-10">
                {/* Poster skeleton */}
                <div className="w-64 md:w-80 lg:w-96 h-[450px] bg-gray-700 rounded-xl shadow-lg"></div>

                {/* Text skeleton */}
                <div className="flex-1 space-y-5">
                    <div className="h-10 w-3/4 bg-gray-700 rounded"></div>
                    <div className="h-5 w-1/3 bg-gray-700 rounded"></div>

                    <div className="flex gap-3 mt-4">
                        <div className="h-6 w-14 bg-gray-700 rounded"></div>
                        <div className="h-6 w-14 bg-gray-700 rounded"></div>
                        <div className="h-6 w-20 bg-gray-700 rounded"></div>
                    </div>

                    <div className="space-y-3 mt-6">
                        <div className="h-4 w-full bg-gray-700 rounded"></div>
                        <div className="h-4 w-11/12 bg-gray-700 rounded"></div>
                        <div className="h-4 w-10/12 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCardSkeleton;
