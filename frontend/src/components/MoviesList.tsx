import MovieCard from "./MovieCard";

const MoviesList = () => {
    const movies = [
        { id: 1, title: "The Matrix", genre: "Sci-Fi", duration: "2h 16m", imageUrl: "https://m.media-amazon.com/images/I/51EGds02hEL._SX300_SY450_QL70_ML2_.jpg" },
        { id: 2, title: "The Matrix", genre: "Sci-Fi", duration: "2h 16m", imageUrl: "https://m.media-amazon.com/images/I/51EGds02hEL._SX300_SY450_QL70_ML2_.jpg" },
        { id: 3, title: "The Matrix", genre: "Sci-Fi", duration: "2h 16m", imageUrl: "https://m.media-amazon.com/images/I/51EGds02hEL._SX300_SY450_QL70_ML2_.jpg" },
        { id: 4, title: "The Matrix", genre: "Sci-Fi", duration: "2h 16m", imageUrl: "https://m.media-amazon.com/images/I/51EGds02hEL._SX300_SY450_QL70_ML2_.jpg" },
    ];

    return (
        <div className="flex flex-col gap-8 md:gap-12 px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#E5E2E1] tracking-wide">Now Playing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movies.map((movie) => (
                    <MovieCard
                        key={movie.id}
                        title={movie.title}
                        genre={movie.genre}
                        duration={movie.duration}
                        imageUrl={movie.imageUrl}
                    />
                ))}
            </div>
        </div>
    )
}

export default MoviesList;