import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieCreateSchema } from "../../schemas/moviesSchemes";
import movieServices from "../../services/movieServices";
import MovieForm from "../../components/Admin/MovieForm";
import MoviePreview from "../../components/Admin/MoviePreview";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import { ArrowLeft } from "lucide-react";
import type { Movie, MovieCreateForm } from "../../types";

const MovieEditFormContainer = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Setup React Hook Form with movie's existing values as defaults
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<MovieCreateForm>({
        resolver: zodResolver(movieCreateSchema),
        defaultValues: {
            title: movie.title,
            description: movie.description,
            poster_url: movie.poster_url,
            backdrop_url: movie.backdrop_url,
            duration_minutes: movie.duration_minutes,
            age_rating: movie.age_rating,
            release_date: movie.release_date,
            status: movie.status as "now_showing" | "coming_soon" | "archived",
            genre_ids: movie.genres.map((g) => g.id)
        }
    });

    const watchPosterUrl = watch("poster_url");
    const watchBackdropUrl = watch("backdrop_url");

    // Mutation for updating movie (submits only modified fields)
    const mutation = useMutation({
        mutationFn: (data: Partial<MovieCreateForm>) => movieServices.updateMovie(movie.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminMovie", movie.id] });
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            navigate(`/admin/movies-management/${movie.id}`);
        }
    });

    const onSubmit = (data: MovieCreateForm) => {
        const dirtyData: Partial<MovieCreateForm> = {};

        // Compare values to send only updated fields to the PUT endpoint
        if (data.title !== movie.title) dirtyData.title = data.title;
        if (data.description !== movie.description) dirtyData.description = data.description;
        if (data.poster_url !== movie.poster_url) dirtyData.poster_url = data.poster_url;
        if (data.backdrop_url !== movie.backdrop_url) dirtyData.backdrop_url = data.backdrop_url;
        if (data.duration_minutes !== movie.duration_minutes) dirtyData.duration_minutes = data.duration_minutes;
        if (data.age_rating !== movie.age_rating) dirtyData.age_rating = data.age_rating;
        if (data.release_date !== movie.release_date) dirtyData.release_date = data.release_date;
        if (data.status !== movie.status) dirtyData.status = data.status;

        // Verify genre list changes
        const originalGenreIds = movie.genres.map((g) => g.id).sort();
        const formGenreIds = [...data.genre_ids].sort();
        const genresChanged =
            originalGenreIds.length !== formGenreIds.length ||
            originalGenreIds.some((gid, idx) => gid !== formGenreIds[idx]);

        if (genresChanged) {
            dirtyData.genre_ids = data.genre_ids;
        }

        if (Object.keys(dirtyData).length > 0) {
            mutation.mutate(dirtyData);
        } else {
            // No changes, simply redirect back to details
            navigate(`/admin/movies-management/${movie.id}`);
        }
    };

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1 text-gray-200 pb-12">
            {/* Header */}
            <div className="py-4 mb-6 mt-4 flex justify-start items-center bg-[#121111]">
                <div>
                    <button
                        onClick={() => navigate(`/admin/movies-management/${movie.id}`)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2 cursor-pointer bg-transparent border-none outline-none"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Details
                    </button>
                    <h1 className="text-3xl font-bold text-gray-200">Edit Movie: {movie.title}</h1>
                    <p className="text-sm text-gray-400 mt-1 font-['Montserrat']">Modify details for this movie entry.</p>
                </div>
            </div>

            {/* Layout Form Grid */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Inputs (Left) */}
                <MovieForm
                    action="edit"
                    register={register}
                    control={control}
                    errors={errors}
                    isPending={mutation.isPending}
                    onCancel={() => navigate(-1)}
                />

                {/* Previews (Right) */}
                <MoviePreview
                    posterUrl={watchPosterUrl}
                    backdropUrl={watchBackdropUrl}
                />
            </form>

            {mutation.isError && (
                <p className="text-sm text-red-500 text-right mt-4 max-w-lg ml-auto">
                    Failed to update movie: {mutation.error instanceof Error ? mutation.error.message : "Server error"}
                </p>
            )}
        </main>
    );
};

const MovieEdit = () => {
    const { id } = useParams<{ id: string }>();

    // Fetch original movie data
    const { data: movie, isLoading, isError } = useQuery({
        queryKey: ["adminMovie", id],
        queryFn: () => movieServices.getMovieById(id!),
        enabled: !!id
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

    return <MovieEditFormContainer movie={movie} />;
};

export default MovieEdit;
