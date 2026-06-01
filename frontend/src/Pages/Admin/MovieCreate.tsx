import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieCreateSchema } from "../../schemas/moviesSchemes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import movieServices from "../../services/movieServices";
import MovieForm from "../../components/Admin/MovieForm";
import MoviePreview from "../../components/Admin/MoviePreview";
import { ArrowLeft } from "lucide-react";
import type { MovieCreateForm } from "../../types";

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

const defaultValues: MovieCreateForm = {
    title: "",
    description: "",
    poster_url: "",
    backdrop_url: "",
    duration_minutes: 120,
    age_rating: 0,
    release_date: today,
    status: "coming_soon",
    genre_ids: []
};

const MovieCreate = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Setup React Hook Form
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors }
    } = useForm<MovieCreateForm>({
        resolver: zodResolver(movieCreateSchema),
        defaultValues
    });

    // Watch image URL fields to display live previews
    const watchPosterUrl = watch("poster_url");
    const watchBackdropUrl = watch("backdrop_url");

    // Mutation for creating a new movie
    const mutation = useMutation({
        mutationFn: (data: MovieCreateForm) => movieServices.createMovie(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            navigate("/admin/movies-management");
        }
    });

    const onSubmit = (data: MovieCreateForm) => {
        mutation.mutate(data);
    };

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1 text-gray-200 pb-12">
            {/* Header */}
            <div className="py-4 mb-6 mt-4 flex justify-between items-center bg-[#121111]">
                <div>
                    <button
                        onClick={() => navigate("/admin/movies-management")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-2 cursor-pointer bg-transparent border-none outline-none"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Table
                    </button>
                    <h1 className="text-3xl font-bold text-gray-200">Create New Movie</h1>
                    <p className="text-sm text-gray-400 mt-1 font-['Montserrat']">Add a new movie to the cinema catalogue.</p>
                </div>
            </div>

            {/* Layout Form Grid */}
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Inputs (Left) */}
                <MovieForm
                    register={register}
                    control={control}
                    errors={errors}
                    isPending={mutation.isPending}
                    onCancel={() => navigate("/admin/movies-management/")}
                />

                {/* Previews (Right) */}
                <MoviePreview
                    posterUrl={watchPosterUrl}
                    backdropUrl={watchBackdropUrl}
                />
            </form>

            {mutation.isError && (
                <p className="text-sm text-red-500 text-right mt-4 max-w-lg ml-auto">
                    Failed to create movie: {mutation.error instanceof Error ? mutation.error.message : "Server error"}
                </p>
            )}
        </main>
    );
};

export default MovieCreate;