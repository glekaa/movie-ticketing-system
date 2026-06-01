import { X, Film } from "lucide-react";
import { FormInput } from "../../Elements/FormElements";
import Button from "../../Elements/Button";
import type { Theater, ScreenCreateForm, ScreenCreateDTO } from "../../../types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { screenCreateSchema } from "../../../schemas/theatersSchemas";

interface AddScreenModalProps {
    theater: Theater;
    onClose: () => void;
    onSubmit: (data: ScreenCreateDTO) => void;
    isPending: boolean;
    error: string;
}

export const AddScreenModal = ({
    theater,
    onClose,
    onSubmit,
    isPending,
    error,
}: AddScreenModalProps) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ScreenCreateForm>({
        resolver: zodResolver(screenCreateSchema),
        defaultValues: {
            name: "",
            total_rows: 10,
            seats_per_row: 12,
        },
    });

    const handleClose = () => {
        onClose();
        reset();
    };

    const handleFormSubmit = (data: ScreenCreateForm) => {
        onSubmit(data);
    };

    const watchTotalRows = watch("total_rows") || 0;
    const watchSeatsPerRow = watch("seats_per_row") || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={handleClose}>
            <div 
                className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Film className="text-blue-400 w-5 h-5" /> Add Screen
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Theater: {theater.name}</p>
                    </div>
                    <button
                        onClick={handleClose}
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
                        label="Screen Name"
                        placeholder="e.g. Screen 1, IMAX"
                        error={errors.name?.message}
                        disabled={isPending}
                        {...register("name")}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormInput
                            label="Total Rows"
                            type="number"
                            error={errors.total_rows?.message}
                            disabled={isPending}
                            {...register("total_rows", { valueAsNumber: true })}
                        />
                        <FormInput
                            label="Seats Per Row"
                            type="number"
                            error={errors.seats_per_row?.message}
                            disabled={isPending}
                            {...register("seats_per_row", { valueAsNumber: true })}
                        />
                    </div>

                    <div className="pt-2 text-xs text-gray-500 flex justify-between bg-white/5 border border-white/5 p-3.5 rounded-xl">
                        <span>Calculated Capacity:</span>
                        <span className="font-bold text-white">{watchTotalRows * watchSeatsPerRow} seats</span>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                        <button
                            type="button"
                            disabled={isPending}
                            onClick={handleClose}
                            className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="px-6 py-2 text-sm"
                        >
                            {isPending ? "Adding..." : "Add Screen"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddScreenModal;
