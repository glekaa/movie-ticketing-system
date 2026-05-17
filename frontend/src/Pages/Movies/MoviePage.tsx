import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { movieUserServices } from "../../services/movieServices";
import type { Movie } from "../../types";
import MovieHero from "../../components/MovieHero";
import Synopsis from "../../components/Synopsis";
import Showtimes from "../../components/Showtimes_temp";
import Cast from "../../components/Cast";
import { Loader2, TriangleAlert } from "lucide-react";

const MoviePage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: movie, isLoading, isError } = useQuery<Movie>({
        queryKey: ["movie", id],
        queryFn: () => movieUserServices.getMovieById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center gap-4 text-white">
                <TriangleAlert className="w-12 h-12 text-red-500" />
                <p className="text-xl text-red-500">Error loading movie</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <MovieHero movie={movie} />
            
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Synopsis & Cast */}
                <div className="lg:col-span-2 flex flex-col gap-12">
                    <Synopsis movie={movie} />
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
