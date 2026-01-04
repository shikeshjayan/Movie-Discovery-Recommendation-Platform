
const GenreBar = ({ setGenre }) => {

    const genres = [
        { name: "Trending", id: "trending" },
        { name: "Action", id: 28 },
        { name: "Comedy", id: 35 },
        { name: "Drama", id: 18 },
        { name: "Sci-Fi", id: 878 },
        { name: "Thriller/Horror", id: 27 }
    ]
    return (
        <div className="genre bg-[#1409E5] w-full h-14 flex gap-8 justify-around items-center italic">
            {genres.map((item) => (
                <span
                    key={item.id} onClick={() => setGenre(item.id)} className="text-[#ECF0FF] cursor-pointer hover:font-bold hover:scale-110 transition-transform">{item.name}</span>
            ))}
        </div>
    )
}

export default GenreBar