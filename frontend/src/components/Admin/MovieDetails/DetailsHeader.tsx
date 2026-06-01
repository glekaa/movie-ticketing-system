import { useState } from "react";
import Button from "../../Elements/Button";

interface DetailsHeaderProps {
    title: string;
    status: string;
    isDeleting?: boolean;
    onStatusChange?: (newStatus: string) => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

const DetailsHeader = ({ title, status, isDeleting = false, onStatusChange, onEdit, onDelete }: DetailsHeaderProps) => {
    const [isConfirming, setIsConfirming] = useState(false);

    return (
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 shadow-xl">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
                <select
                    className="bg-[#222222] border border-gray-700 text-white rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 cursor-pointer"
                    value={status}
                    onChange={(e) => onStatusChange?.(e.target.value)}
                >
                    <option value="now_showing">Now Showing</option>
                    <option value="coming_soon">Coming Soon</option>
                    <option value="archived">Archived</option>
                </select>
            </div>
            <div className="flex items-center gap-3">
                {isConfirming ? (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                onDelete?.();
                                setIsConfirming(false);
                            }}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-red-600/20"
                        >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </button>
                        <button
                            onClick={() => setIsConfirming(false)}
                            disabled={isDeleting}
                            className="px-4 py-2 text-sm font-semibold bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-200 rounded-full transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <>
                        <Button variant="secondary" onClick={onEdit}>Edit Details</Button>
                        <Button
                            onClick={() => setIsConfirming(true)}
                            className="!bg-red-500/10 !text-red-500 hover:!bg-red-500 hover:!text-white border border-red-500/20"
                            variant="secondary"
                        >
                            Delete Movie
                        </Button>
                    </>
                )}
            </div>
        </section>
    );
};

export default DetailsHeader;
