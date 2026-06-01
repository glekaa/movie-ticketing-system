import { useEffect } from "react";
import { X, Building2 } from "lucide-react";
import { FormInput } from "../../Elements/FormElements";
import Button from "../../Elements/Button";
import type { Theater, TheaterCreateForm, TheaterUpdateDTO } from "../../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { theaterCreateSchema } from "../../../schemas/theatersSchemas";

interface EditTheaterModalProps {
    theater: Theater | null;
    onClose: () => void;
    onSubmit: (data: TheaterUpdateDTO) => void;
    isPending: boolean;
    error: string;
}

export const EditTheaterModal = ({
    theater,
    onClose,
    onSubmit,
    isPending,
    error,
}: EditTheaterModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TheaterCreateForm>({
        resolver: zodResolver(theaterCreateSchema),
    });

    useEffect(() => {
        if (theater) {
            reset({
                name: theater.name,
                location: theater.location,
            });
        }
    }, [theater, reset]);

    if (!theater) return null;

    const handleFormSubmit = (data: TheaterCreateForm) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Building2 className="text-blue-400 w-5 h-5" /> Edit Theater
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Theater: {theater.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                    {error && (
                        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                            {error}
                        </div>
                    )}

                    <FormInput
                        label="Theater Name"
                        placeholder="e.g. Cinema City Times Square"
                        error={errors.name?.message}
                        disabled={isPending}
                        {...register("name")}
                    />

                    <FormInput
                        label="Location"
                        placeholder="e.g. New York, NY"
                        error={errors.location?.message}
                        disabled={isPending}
                        {...register("location")}
                    />

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={onClose}
                            className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 text-sm"
                        >
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTheaterModal;
