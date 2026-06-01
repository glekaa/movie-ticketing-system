import { formatDuration } from "../../utils";
import type { Movie } from "../../types";

interface MovieCardProps {
    movie: Movie;
    onClick: () => void;
    main?: boolean;
}

const MovieCard = ({ movie, main = false, onClick }: MovieCardProps) => {
    return (
        <div className={`flex flex-col gap-2 sm:gap-3 group cursor-pointer shrink-0 border border-[#40403f] rounded-2xl shadow-[0px_5px_10px_2px_#292827] ${main ? "w-[42vw] sm:w-[200px] md:w-[250px] lg:w-[350px]" : "w-full"}`} onClick={onClick}>
            <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg">
                <img
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1 px-2 pb-2 mt-0.5 sm:mt-1">
                <h3 className="text-sm sm:text-lg md:text-xl font-medium text-[#E5E2E1] tracking-wide line-clamp-1">{movie.title}</h3>
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs md:text-[15px] text-gray-400 font-['Inter']">
                    <span>{movie.genres[0]?.name || "Unknown"}</span>
                    <span className="text-[8px] sm:text-[10px] text-gray-500">•</span>
                    <span>{formatDuration(movie.duration_minutes)}</span>
                </div>
            </div>
        </div>
    )
}

export default MovieCard;