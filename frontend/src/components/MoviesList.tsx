import MovieCard from "./MovieCard";
import { useQuery } from "@tanstack/react-query";
import { movieUserServices } from "../services/movieServices";
import type { Movie } from "../types";
import { TriangleAlert, Loader2 } from "lucide-react";

const MoviesList = ({ status = "now_showing" }: { status?: "now_showing" | "coming_soon" }) => {
    const queryFn = status === "now_showing" ? movieUserServices.getNowPlayingMovies : movieUserServices.getUpcomingMovies;

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies", status],
        queryFn,
    });

    return (
        <div className="flex flex-col gap-8 md:gap-12 px-4 md:px-8 mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#E5E2E1] tracking-wide">Now Playing</h2>
            {isLoading ? (
                <div className="flex items-center justify-center gap-4">
                    <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
                    <p className="text-2xl text-gray-500">Loading movies</p>
                </div>
            ) : isError ? (
                <div className="flex items-center justify-center gap-4">
                    <TriangleAlert className="w-12 h-12 text-red-500" />
                    <p className="text-2xl text-red-500">Error loading movies</p>
                </div>
            ) :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {movies?.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            genre={movie.genres[0]}
                            duration={movie.duration_minutes}
                            imageUrl={movie.poster_url}
                        />
                    ))}
                </div>}
        </div>
    )
}

export default MoviesList;