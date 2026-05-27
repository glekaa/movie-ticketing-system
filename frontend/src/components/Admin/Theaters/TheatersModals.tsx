import { useState, useEffect } from "react";
import { X, Film, Building2 } from "lucide-react";
import { FormInput } from "../../Elements/FormElements";
import Button from "../../Elements/Button";
import type { Theater } from "../../../types";

interface TheatersModalsProps {
    // Add Screen
    addScreenTheater: Theater | null;
    onCloseAddScreen: () => void;
    onCreateScreen: (theaterId: string, data: { name: string; total_rows: number; seats_per_row: number }) => void;
    createScreenPending: boolean;
    createScreenError: string;

    // Add Theater
    showAddTheaterModal: boolean;
    onCloseAddTheater: () => void;
    onCreateTheater: (data: { name: string; location: string }) => void;
    createTheaterPending: boolean;
    createTheaterError: string;

    // Edit Theater
    editTheater: Theater | null;
    onCloseEditTheater: () => void;
    onUpdateTheater: (theaterId: string, data: { name: string; location: string }) => void;
    updateTheaterPending: boolean;
    updateTheaterError: string;
}

export const TheatersModals = ({
    addScreenTheater,
    onCloseAddScreen,
    onCreateScreen,
    createScreenPending,
    createScreenError,

    showAddTheaterModal,
    onCloseAddTheater,
    onCreateTheater,
    createTheaterPending,
    createTheaterError,

    editTheater,
    onCloseEditTheater,
    onUpdateTheater,
    updateTheaterPending,
    updateTheaterError,
}: TheatersModalsProps) => {
    // Add Screen Form state
    const [screenName, setScreenName] = useState("");
    const [totalRows, setTotalRows] = useState(10);
    const [seatsPerRow, setSeatsPerRow] = useState(12);

    // Add Theater Form state
    const [theaterName, setTheaterName] = useState("");
    const [theaterLocation, setTheaterLocation] = useState("");

    // Edit Theater Form state
    const [editTheaterName, setEditTheaterName] = useState("");
    const [editTheaterLocation, setEditTheaterLocation] = useState("");

    // Sync Edit Forms when active modal items change
    useEffect(() => {
        if (editTheater) {
            setEditTheaterName(editTheater.name);
            setEditTheaterLocation(editTheater.location);
        }
    }, [editTheater]);

    const handleAddScreenSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addScreenTheater) return;
        onCreateScreen(addScreenTheater.id, {
            name: screenName.trim(),
            total_rows: Number(totalRows),
            seats_per_row: Number(seatsPerRow),
        });
    };

    const handleAddTheaterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreateTheater({
            name: theaterName.trim(),
            location: theaterLocation.trim(),
        });
    };

    const handleEditTheaterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTheater) return;
        onUpdateTheater(editTheater.id, {
            name: editTheaterName.trim(),
            location: editTheaterLocation.trim(),
        });
    };

    // Reset helper functions when closing
    const handleCloseAddScreen = () => {
        onCloseAddScreen();
        setScreenName("");
        setTotalRows(10);
        setSeatsPerRow(12);
    };

    const handleCloseAddTheater = () => {
        onCloseAddTheater();
        setTheaterName("");
        setTheaterLocation("");
    };

    return (
        <>
            {/* Modal: Add Screen */}
            {addScreenTheater && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={handleCloseAddScreen}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Film className="text-blue-400 w-5 h-5" /> Add Screen
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Theater: {addScreenTheater.name}</p>
                            </div>
                            <button
                                onClick={handleCloseAddScreen}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddScreenSubmit} className="space-y-4">
                            {createScreenError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {createScreenError}
                                </div>
                            )}

                            <FormInput
                                label="Screen Name"
                                placeholder="e.g. Screen 1, IMAX"
                                value={screenName}
                                onChange={(e) => setScreenName(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Total Rows"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={totalRows}
                                    onChange={(e) => setTotalRows(Math.max(1, Number(e.target.value)))}
                                    required
                                />
                                <FormInput
                                    label="Seats Per Row"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={seatsPerRow}
                                    onChange={(e) => setSeatsPerRow(Math.max(1, Number(e.target.value)))}
                                    required
                                />
                            </div>

                            <div className="pt-2 text-xs text-gray-500 flex justify-between bg-white/5 border border-white/5 p-3.5 rounded-xl">
                                <span>Calculated Capacity:</span>
                                <span className="font-bold text-white">{totalRows * seatsPerRow} seats</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    disabled={createScreenPending}
                                    onClick={handleCloseAddScreen}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={createScreenPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {createScreenPending ? "Adding..." : "Add Screen"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Add Theater */}
            {showAddTheaterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={handleCloseAddTheater}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Building2 className="text-blue-400 w-5 h-5" /> Add New Theater
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Define a new physical venue location.</p>
                            </div>
                            <button
                                onClick={handleCloseAddTheater}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTheaterSubmit} className="space-y-4">
                            {createTheaterError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {createTheaterError}
                                </div>
                            )}

                            <FormInput
                                label="Theater Name"
                                placeholder="e.g. Cinema City Times Square"
                                value={theaterName}
                                onChange={(e) => setTheaterName(e.target.value)}
                                required
                            />

                            <FormInput
                                label="Location"
                                placeholder="e.g. New York, NY"
                                value={theaterLocation}
                                onChange={(e) => setTheaterLocation(e.target.value)}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    disabled={createTheaterPending}
                                    onClick={handleCloseAddTheater}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={createTheaterPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {createTheaterPending ? "Creating..." : "Create Theater"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Theater */}
            {editTheater && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={onCloseEditTheater}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Building2 className="text-blue-400 w-5 h-5" /> Edit Theater
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Theater: {editTheater.name}</p>
                            </div>
                            <button
                                onClick={onCloseEditTheater}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditTheaterSubmit} className="space-y-4">
                            {updateTheaterError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {updateTheaterError}
                                </div>
                            )}

                            <FormInput
                                label="Theater Name"
                                placeholder="e.g. Cinema City Times Square"
                                value={editTheaterName}
                                onChange={(e) => setEditTheaterName(e.target.value)}
                                required
                            />

                            <FormInput
                                label="Location"
                                placeholder="e.g. New York, NY"
                                value={editTheaterLocation}
                                onChange={(e) => setEditTheaterLocation(e.target.value)}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    disabled={updateTheaterPending}
                                    onClick={onCloseEditTheater}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={updateTheaterPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {updateTheaterPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default TheatersModals;
