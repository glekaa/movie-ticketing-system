import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../../services/movieServices";
import type { Movie } from "../../types";
import MovieHero from "../../components/Movies/MovieHero";
import Synopsis from "../../components/Movies/Synopsis";
import Showtimes from "../../components/Movies/Showtimes";
import Cast from "../../components/Movies/Cast";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";

const MoviePage = () => {
    const { id } = useParams<{ id: string }>();

    const { data: movie, isLoading, isError } = useQuery<Movie>({
        queryKey: ["movie", id],
        queryFn: () => movieServices.getMovieById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <LoadingState />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <ErrorState message="Error loading movie" />
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
                    <Cast movie={movie} />
                </div>

                {/* Right Column: Showtime Selector */}
                <div className="lg:col-span-1">
                    <Showtimes movieId={id!} />
                </div>
            </div>
        </div>
    )
}

export default MoviePage;
