import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import movieServices from "../../services/movieServices";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";

import DetailsHeader from "../../components/Admin/MovieDetails/DetailsHeader";
import DetailsMedia from "../../components/Admin/MovieDetails/DetailsMedia";
import DetailsMetadata from "../../components/Admin/MovieDetails/DetailsMetadata";
import DetailsNarrative from "../../components/Admin/MovieDetails/DetailsNarrative";
import DetailsShowtimes from "../../components/Admin/MovieDetails/DetailsShowtimes";
import DetailsFooter from "../../components/Admin/MovieDetails/DetailsFooter";

const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Fetch movie details
    const { data: movie, isLoading, isError } = useQuery({
        queryKey: ["adminMovie", id],
        queryFn: () => movieServices.getMovieById(id!),
        enabled: !!id,
    });

    // Fetch showtimes linked to the movie
    const { data: showtimes, isLoading: isShowtimesLoading } = useQuery({
        queryKey: ["adminMovieShowtimes", id],
        queryFn: () => movieServices.getMovieShowtimes(id!),
        enabled: !!id,
    });

    // Mutation to update movie status
    const statusMutation = useMutation({
        mutationFn: (newStatus: string) => movieServices.updateMovie(id!, { status: newStatus }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminMovie", id] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
        }
    });

    // Mutation to delete movie
    const deleteMutation = useMutation({
        mutationFn: () => movieServices.deleteMovie(id!),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            navigate("/admin/movies-management");
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <LoadingState />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <ErrorState />
        );
    }

    const handleCopyId = () => {
        navigator.clipboard.writeText(movie.id);
    };

    return (
        <main className="p-6 lg:p-10 space-y-10 text-gray-200">
            {/* 1. Action Header */}
            <DetailsHeader
                title={movie.title}
                status={movie.status}
                isDeleting={deleteMutation.isPending}
                onStatusChange={(status) => statusMutation.mutate(status)}
                onEdit={() => navigate(`/admin/movies-management/${movie.id}/edit`)}
                onDelete={() => deleteMutation.mutate()}
            />

            {/* 2. Media Grid (Poster & Backdrop) */}
            <DetailsMedia
                title={movie.title}
                posterUrl={movie.poster_url}
                backdropUrl={movie.backdrop_url}
            />

            {/* 3. Core Metadata Row */}
            <DetailsMetadata
                language={movie.language}
                durationMinutes={movie.duration_minutes}
                ageRating={movie.age_rating}
                releaseDate={movie.release_date}
                tmdbRating={movie.tmdb_rating}
            />

            {/* 4. Narrative Overview & Cast (Director, Actors, Genres) */}
            <DetailsNarrative
                description={movie.description}
                plot={movie.plot}
                genres={movie.genres}
                director={movie.director}
                actors={movie.actors}
            />

            {/* 5. Showtimes Table */}
            <DetailsShowtimes
                showtimes={showtimes}
                isLoading={isShowtimesLoading}
            />

            {/* 6. Info Footprint */}
            <DetailsFooter
                movieId={movie.id}
                createdAt={movie.created_at}
                updatedAt={movie.updated_at}
                onCopyId={handleCopyId}
            />
        </main>
    );
};

export default MovieDetails;