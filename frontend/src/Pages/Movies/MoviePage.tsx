import MovieHero from "../../components/MovieHero";
import Synopsis from "../../components/Synopsis";
import Showtimes from "../../components/Showtimes_temp";
import Cast from "../../components/Cast";

const MoviePage = () => {
    return (
        <div className="min-h-screen text-white">
            <MovieHero />
            
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Synopsis & Cast */}
                <div className="lg:col-span-2 flex flex-col gap-12">
                    <Synopsis />
                    <Cast />
                </div>

                {/* Right Column: Showtime Selector */}
                <div className="lg:col-span-1">
                    <Showtimes />
                </div>
            </div>
        </div>
    )
}

export default MoviePage;
