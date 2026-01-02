import { useState } from "react";
import { fetchSearch } from "../../services/tmdbApi";
import SearchResult from "./SearchResult";

const SearchBox = () => {
    const [searchMovies, setSearchMovies] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showResults, setShowResults] = useState(false);

    // Using 'onChange' for instant search feel (or keep your onSubmit if preferred)
    const handleInputChange = async (e) => {
        const val = e.target.value;
        setInputValue(val);

        if (val.trim().length > 1) {
            try {
                const data = await fetchSearch(val);
                setSearchMovies(data.results || data); // Adjust based on your API response structure
                setShowResults(true);
            } catch (error) {
                console.error("Search failed", error);
            }
        } else {
            setSearchMovies([]);
            setShowResults(false);
        }
    };

    const clearSearch = () => {
        setInputValue("");
        setShowResults(false);
    };

    return (
        <div className="search-box relative flex flex-col items-center w-full max-w-md z-50">
            <form className="w-full relative">
                <input style={{ paddingInline: "2.5rem" }}
                    value={inputValue}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Search for movies, shows..."
                    className="w-full h-10 px-4 pl-10 border border-blue-100 rounded bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-gray-400 text-sm"
                />
                {/* Search Icon Positioned Absolute */}
                <span className="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
                <span className="absolute right-3 top-2.5 text-gray-400 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 640 640">
                        <path fill="#ffffff" d="M320 64C267 64 224 107 224 160L224 288C224 341 267 384 320 384C373 384 416 341 416 288L416 160C416 107 373 64 320 64zM176 248C176 234.7 165.3 224 152 224C138.7 224 128 234.7 128 248L128 288C128 385.9 201.3 466.7 296 478.5L296 528L248 528C234.7 528 224 538.7 224 552C224 565.3 234.7 576 248 576L392 576C405.3 576 416 565.3 416 552C416 538.7 405.3 528 392 528L344 528L344 478.5C438.7 466.7 512 385.9 512 288L512 248C512 234.7 501.3 224 488 224C474.7 224 464 234.7 464 248L464 288C464 367.5 399.5 432 320 432C240.5 432 176 367.5 176 288L176 248z" /></svg>
                </span>
            </form>

            {/* Pass props to the Result component */}
            {showResults && (
                <SearchResult
                    movies={searchMovies}
                    onClose={clearSearch}
                />
            )}
        </div>
    );
};

export default SearchBox;