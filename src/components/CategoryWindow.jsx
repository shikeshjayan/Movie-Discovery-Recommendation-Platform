const CategoryWindow = ({ isOpen }) => {

    const genres = [
        { name: "Trending", id: "trending" },
        { name: "Action", id: 28 },
        { name: "Comedy", id: 35 },
        { name: "Drama", id: 18 },
        { name: "Sci-Fi", id: 878 },
        { name: "Thriller/Horror", id: 27 }
    ]

    return (
        <div className={`${isOpen ? "hidden" : "block"} category-page absolute left-1/2 top-full transform -translate-x-1/2 mt-2 w-84 h-auto bg-white shadow-lg rounded-b text-black`}>
            <select name="Genre">
                <option value="Action">Genre</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
                <option value="Action">Comedy</option>
            </select>
        </div>
    )
}

export default CategoryWindow