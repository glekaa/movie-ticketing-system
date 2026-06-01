import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import genresServices from "../../services/genresServices";
import Button from "../Elements/Button";
import { FormInput, FormTextarea, FormSelect } from "../Elements/FormElements";
import { FILTER_AGE_OPTIONS } from "../../constants/filter";
import { Loader2 } from "lucide-react";
import type { MovieCreateForm, Genre } from "../../types";

interface MovieFormProps {
    action?: "create" | "edit";
    register: UseFormRegister<MovieCreateForm>;
    control: Control<MovieCreateForm>;
    errors: FieldErrors<MovieCreateForm>;
    isPending: boolean;
    onCancel: () => void;
}

const MovieForm = ({ action = "create", register, control, errors, isPending, onCancel }: MovieFormProps) => {
    // Fetch genres from backend
    const { data: genres, isLoading: isGenresLoading } = useQuery({
        queryKey: ["genres"],
        queryFn: () => genresServices.getAllGenres()
    });

    return (
        <section className="lg:col-span-2 bg-[#1A1A1A] border border-gray-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Title */}
            <FormInput
                label="Movie Title"
                placeholder="Enter movie title"
                error={errors.title?.message}
                {...register("title")}
            />

            {/* Description */}
            <FormTextarea
                label="Description"
                placeholder="Enter movie summary or plot outline"
                error={errors.description?.message}
                {...register("description")}
            />

            {/* Image URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    label="Poster Image URL"
                    placeholder="https://example.com/poster.jpg"
                    error={errors.poster_url?.message}
                    {...register("poster_url")}
                />
                <FormInput
                    label="Backdrop Image URL"
                    placeholder="https://example.com/backdrop.jpg"
                    error={errors.backdrop_url?.message}
                    {...register("backdrop_url")}
                />
            </div>

            {/* Duration & Release Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                    type="number"
                    label="Duration (minutes)"
                    error={errors.duration_minutes?.message}
                    {...register("duration_minutes", { valueAsNumber: true })}
                />
                <FormInput
                    type="date"
                    label="Release Date"
                    error={errors.release_date?.message}
                    {...register("release_date")}
                />
            </div>

            {/* Age Rating & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                    label="Age Rating"
                    error={errors.age_rating?.message}
                    {...register("age_rating", { valueAsNumber: true })}
                >
                    {FILTER_AGE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[#121111]">
                            {opt.label}
                        </option>
                    ))}
                </FormSelect>
                <FormSelect
                    label="Status"
                    error={errors.status?.message}
                    {...register("status")}
                >
                    <option value="coming_soon" className="bg-[#121111]">Coming Soon</option>
                    <option value="now_showing" className="bg-[#121111]">Now Showing</option>
                    <option value="archived" className="bg-[#121111]">Archived</option>
                </FormSelect>
            </div>

            {/* Genres tag list selection */}
            <div className="space-y-2">
                <label className="text-xs text-gray-400 font-semibold block">Genres</label>
                {isGenresLoading ? (
                    <div className="flex items-center gap-2 text-gray-500 animate-pulse py-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Loading genres...
                    </div>
                ) : (
                    <Controller
                        name="genre_ids"
                        control={control}
                        render={({ field }) => {
                            const selectedIds = field.value || [];
                            const toggleGenre = (genreId: string) => {
                                const nextValue = selectedIds.includes(genreId)
                                    ? selectedIds.filter((id) => id !== genreId)
                                    : [...selectedIds, genreId];
                                field.onChange(nextValue);
                            };
                            return (
                                <div>
                                    <div className="flex flex-wrap gap-2 py-2">
                                        {genres?.map((genre: Genre) => {
                                            const isSelected = selectedIds.includes(genre.id);
                                            return (
                                                <button
                                                    key={genre.id}
                                                    type="button"
                                                    onClick={() => toggleGenre(genre.id)}
                                                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 cursor-pointer ${isSelected
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30 scale-105"
                                                        : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                                                        }`}
                                                >
                                                    {genre.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.genre_ids && (
                                        <p className="text-xs text-red-500 mt-1">{errors.genre_ids.message}</p>
                                    )}
                                </div>
                            );
                        }}
                    />
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-white/5">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isPending}
                >
                    {isPending ? "Submitting..." : action === "create" ? "Create" : "Update"}
                </Button>
            </div>
        </section>
    );
};

export default MovieForm;
