import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import genresServices from "../../../services/genresServices";
import Button from "../../Elements/Button";
import { FormInput } from "../../Elements/FormElements";
import { Plus } from "lucide-react";
import type { GenreCreateDTO } from "../../../types";
import { genreCreateSchema, type GenreCreateForm } from "../../../schemas/genresSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

export const GenreAddForm = () => {
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors }
    } = useForm<GenreCreateForm>({
        defaultValues: {
            name: ""
        },
        resolver: zodResolver(genreCreateSchema)
    });

    const createMutation = useMutation({
        mutationFn: (data: GenreCreateDTO) => genresServices.createGenre(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] });
            reset();
        },
        onError: (err: any) => {
            setError("name", {
                type: "server",
                message: err.response?.data?.detail || "Failed to create genre."
            });
        }
    });

    const onSubmit = (data: GenreCreateForm) => {
        if (!data.name.trim()) {
            setError("name", {
                type: "manual",
                message: "Genre name is required."
            });
            return;
        }
        createMutation.mutate({ name: data.name.trim(), slug: data.name.trim().toLowerCase().replace(" ", "-") });
    };

    return (
        <div className="bg-[#1a1919] border border-white/5 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold font-['Montserrat'] mb-1">Create New Genre</h2>
            <p className="text-xs text-gray-400 mb-6">Add a new category classification for movies</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormInput
                    label="Genre Name"
                    placeholder="e.g. Science Fiction"
                    error={errors.name?.message}
                    disabled={createMutation.isPending}
                    {...register("name", {
                        required: "Genre name is required."
                    })}
                />

                <Button
                    type="submit"
                    className="w-full py-3 mt-4 text-sm flex items-center justify-center gap-2"
                    variant="primary"
                    disabled={createMutation.isPending}
                >
                    {createMutation.isPending ? (
                        <>
                            Creating...
                        </>
                    ) : (
                        <>
                            <Plus className="w-4 h-4" />
                            Add Genre
                        </>
                    )}
                </Button>
            </form>
        </div>
    );
};

export default GenreAddForm;
