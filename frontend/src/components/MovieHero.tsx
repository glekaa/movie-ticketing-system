import Tag from "./Tag";
import { Play } from "lucide-react";
import HeroOverlay from "./HeroOverlay";
import Button from "./Button";
import type { Movie } from "../types";
import { buildMovieTags } from "../utils";

interface MovieHeroProps {
    movie: Movie;
}

const MovieHero = ({ movie }: MovieHeroProps) => {
    const tags = buildMovieTags(movie);

    return (
        <div className="relative w-full h-[80vh] overflow-hidden px-6 md:px-10 pb-20 pt-32">
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `url(${movie.backdrop_url})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            <HeroOverlay variant="subtle" />

            <div className="h-full max-w-7xl mx-auto relative flex flex-row items-end gap-10">
                {/* Poster */}
                <div className="w-40 md:w-56 shrink-0 hidden sm:block shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl border border-white/10 overflow-hidden">
                    <img src={movie.poster_url} alt={`${movie.title} Poster`} className="w-full h-auto block" />
                </div>

                {/* Info */}
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex flex-row gap-2">
                        {tags.map((tag, index) => (
                            <Tag key={index} variant={tag.type}>{tag.text}</Tag>
                        ))}
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-wider uppercase">
                        {movie.title}
                    </h1>

                    <div className="flex flex-row items-center gap-6 mt-2">
                        {movie.tmdb_rating && (
                            <div className="flex items-center gap-2.5 text-white font-semibold">
                                <span className="px-1.5 py-0.5 rounded bg-gradient-to-r from-teal-400 to-blue-500 text-xs font-bold text-white uppercase tracking-wider">TMDB</span>
                                <span className="text-xl">{movie.tmdb_rating} <span className="text-gray-400 text-sm">/ 10</span></span>
                            </div>
                        )}
                        <Button icon={<Play />} className="py-3 text-sm" variant="secondary">Watch Trailer</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieHero;
