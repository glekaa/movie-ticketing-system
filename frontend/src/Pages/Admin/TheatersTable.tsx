import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import theaterServices from "../../services/theaterServices";
import type { Theater, Screen } from "../../types";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table";
import { FilterIcon, PlusIcon, MapPin, Building2, Film, Users, X, Edit2, Trash2 } from "lucide-react";
import Button from "../../components/Elements/Button";
import SearchInput from "../../components/Filter/SearchInput";
import FilterButton from "../../components/Filter/FilterButton";
import { FormInput } from "../../components/Elements/FormElements";

const TheatersTable = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    const [search, setSearch] = useState("");
    const [activeLocation, setActiveLocation] = useState("all");
    
    // Modal states
    const [addScreenTheater, setAddScreenTheater] = useState<Theater | null>(null);
    const [showAddTheaterModal, setShowAddTheaterModal] = useState(false);
    const [editTheater, setEditTheater] = useState<Theater | null>(null);
    const [deleteTheaterId, setDeleteTheaterId] = useState<string | null>(null);
    const [editScreen, setEditScreen] = useState<{ theaterId: string; screen: Screen } | null>(null);
    const [deleteScreenId, setDeleteScreenId] = useState<string | null>(null);
    
    // Add Screen Form state
    const [screenName, setScreenName] = useState("");
    const [totalRows, setTotalRows] = useState(10);
    const [seatsPerRow, setSeatsPerRow] = useState(12);
    const [screenError, setScreenError] = useState("");

    // Edit Screen Form state
    const [editScreenName, setEditScreenName] = useState("");
    const [editTotalRows, setEditTotalRows] = useState(10);
    const [editSeatsPerRow, setEditSeatsPerRow] = useState(12);
    
    // Add Theater Form state
    const [theaterName, setTheaterName] = useState("");
    const [theaterLocation, setTheaterLocation] = useState("");
    const [theaterError, setTheaterError] = useState("");

    // Edit Theater Form state
    const [editTheaterName, setEditTheaterName] = useState("");
    const [editTheaterLocation, setEditTheaterLocation] = useState("");

    // Fetch Theaters
    const { data: theaters, isLoading } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters(),
    });

    // Sync Edit Forms when active modal items change
    useEffect(() => {
        if (editTheater) {
            setEditTheaterName(editTheater.name);
            setEditTheaterLocation(editTheater.location);
            setTheaterError("");
        }
    }, [editTheater]);

    useEffect(() => {
        if (editScreen) {
            setEditScreenName(editScreen.screen.name);
            setEditTotalRows(editScreen.screen.total_rows);
            setEditSeatsPerRow(editScreen.screen.seats_per_row);
            setScreenError("");
        }
    }, [editScreen]);

    // Mutations
    const createTheaterMutation = useMutation({
        mutationFn: (data: { name: string; location: string }) => theaterServices.createTheater(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setShowAddTheaterModal(false);
            setTheaterName("");
            setTheaterLocation("");
            setTheaterError("");
        },
        onError: (err: any) => {
            setTheaterError(err.response?.data?.detail || "Failed to create theater. Please try again.");
        }
    });

    const updateTheaterMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; location: string } }) => 
            theaterServices.updateTheater(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setEditTheater(null);
            setTheaterError("");
        },
        onError: (err: any) => {
            setTheaterError(err.response?.data?.detail || "Failed to update theater. Please try again.");
        }
    });

    const deleteTheaterMutation = useMutation({
        mutationFn: (id: string) => theaterServices.deleteTheater(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setDeleteTheaterId(null);
        }
    });

    const createScreenMutation = useMutation({
        mutationFn: ({ theaterId, data }: { theaterId: string; data: { name: string; total_rows: number; seats_per_row: number } }) => 
            theaterServices.createScreen(theaterId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setAddScreenTheater(null);
            setScreenName("");
            setTotalRows(10);
            setSeatsPerRow(12);
            setScreenError("");
        },
        onError: (err: any) => {
            setScreenError(err.response?.data?.detail || "Failed to add screen. Please try again.");
        }
    });

    const updateScreenMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; total_rows: number; seats_per_row: number } }) => 
            theaterServices.updateScreen(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setEditScreen(null);
            setScreenError("");
        },
        onError: (err: any) => {
            setScreenError(err.response?.data?.detail || "Failed to update screen. Please try again.");
        }
    });

    const deleteScreenMutation = useMutation({
        mutationFn: (id: string) => theaterServices.deleteScreen(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setDeleteScreenId(null);
        }
    });

    // Extract unique locations for the filter
    const locations = useMemo(() => {
        if (!theaters) return [];
        const unique = new Set(theaters.map(t => t.location));
        return Array.from(unique).sort();
    }, [theaters]);

    // Filter and search
    const filteredTheaters = useMemo(() => {
        if (!theaters) return [];
        return theaters.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                                  t.location.toLowerCase().includes(search.toLowerCase());
            const matchesLocation = activeLocation === "all" || t.location === activeLocation;
            return matchesSearch && matchesLocation;
        });
    }, [theaters, search, activeLocation]);

    // Statistics
    const stats = useMemo(() => {
        if (!theaters) return { totalTheaters: 0, totalScreens: 0, totalCapacity: 0 };
        const totalTheaters = theaters.length;
        const totalScreens = theaters.reduce((acc, t) => acc + t.screens.length, 0);
        const totalCapacity = theaters.reduce((acc, t) => 
            acc + t.screens.reduce((accS, s) => accS + (s.total_rows * s.seats_per_row), 0), 0
        );
        return { totalTheaters, totalScreens, totalCapacity };
    }, [theaters]);

    const handleAddTheaterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!theaterName.trim() || !theaterLocation.trim()) {
            setTheaterError("All fields are required.");
            return;
        }
        createTheaterMutation.mutate({ name: theaterName.trim(), location: theaterLocation.trim() });
    };

    const handleEditTheaterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTheater) return;
        if (!editTheaterName.trim() || !editTheaterLocation.trim()) {
            setTheaterError("All fields are required.");
            return;
        }
        updateTheaterMutation.mutate({
            id: editTheater.id,
            data: { name: editTheaterName.trim(), location: editTheaterLocation.trim() }
        });
    };

    const handleAddScreenSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addScreenTheater) return;
        if (!screenName.trim()) {
            setScreenError("Screen name is required.");
            return;
        }
        if (totalRows <= 0 || seatsPerRow <= 0) {
            setScreenError("Rows and Seats per row must be positive numbers.");
            return;
        }
        createScreenMutation.mutate({
            theaterId: addScreenTheater.id,
            data: {
                name: screenName.trim(),
                total_rows: Number(totalRows),
                seats_per_row: Number(seatsPerRow),
            }
        });
    };

    const handleEditScreenSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editScreen) return;
        if (!editScreenName.trim()) {
            setScreenError("Screen name is required.");
            return;
        }
        if (editTotalRows <= 0 || editSeatsPerRow <= 0) {
            setScreenError("Rows and Seats per row must be positive numbers.");
            return;
        }
        updateScreenMutation.mutate({
            id: editScreen.screen.id,
            data: {
                name: editScreenName.trim(),
                total_rows: Number(editTotalRows),
                seats_per_row: Number(editSeatsPerRow),
            }
        });
    };

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1">
            {/* Tabs Navigation */}
            <div className="flex gap-6 border-b border-gray-800/50 mt-6 mb-2">
                <button
                    onClick={() => navigate("/admin/movies-management")}
                    className="pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 border-transparent text-gray-500 hover:text-gray-300 cursor-pointer transition-all"
                >
                    Movies
                </button>
                <button
                    onClick={() => navigate("/admin/theaters-management")}
                    className="pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 border-blue-500 text-blue-400 cursor-pointer transition-all"
                >
                    Theaters
                </button>
            </div>

            <div className="sticky top-0 z-10 py-4 mb-6 mt-2 flex justify-between items-end bg-[#121111]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-200">Theaters Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage physical locations and theater screens.</p>
                </div>
                <div className="flex items-center gap-4">
                    <SearchInput
                        placeholder="Search theaters..."
                        value={search}
                        onChange={setSearch}
                    />
                    <Button
                        className="whitespace-nowrap"
                        variant="primary"
                        icon={<PlusIcon className="w-4 h-4" />}
                        onClick={() => setShowAddTheaterModal(true)}
                    >
                        Add Theater
                    </Button>
                </div>
            </div>

            <div className="flex flex-row gap-6 text-white pb-8">
                {/* Sidebar Filter and Stats */}
                <aside className="flex flex-col gap-6 p-6 w-64 shrink-0 h-fit bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl">
                    <section className="space-y-4">
                        <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2">
                            <FilterIcon className="w-5 h-5" /> Locations
                        </h2>
                        <div className="flex flex-col gap-2 items-start">
                            <FilterButton
                                option={{ label: "All Locations", value: "all" }}
                                activeCategory={activeLocation}
                                setValue={setActiveLocation}
                            />
                            {locations.map(loc => (
                                <FilterButton
                                    key={loc}
                                    option={{ label: loc, value: loc }}
                                    activeCategory={activeLocation}
                                    setValue={setActiveLocation}
                                />
                            ))}
                        </div>
                    </section>

                    <hr className="border-gray-800" />

                    <section className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Statistics</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                                    <Building2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Total Locations</span>
                                    <span className="text-sm font-bold text-white">{stats.totalTheaters}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                                    <Film className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Total Screens</span>
                                    <span className="text-sm font-bold text-white">{stats.totalScreens}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                                    <Users className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 block">Seating Capacity</span>
                                    <span className="text-sm font-bold text-white">{stats.totalCapacity}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>

                {/* Table Section */}
                <section className="flex-1 min-w-0">
                    {isLoading ? (
                        <div className="text-gray-500 animate-pulse">Loading theaters data...</div>
                    ) : filteredTheaters.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-[#1A1A1A] border border-gray-800 rounded-xl">
                            <Building2 className="w-12 h-12 text-gray-600 mb-3" />
                            <p className="text-gray-400 text-lg font-medium">No theaters found</p>
                            <p className="text-gray-600 text-sm mt-1">Try refining your search or add a new theater location.</p>
                        </div>
                    ) : (
                        <Table>
                            <Thead>
                                <Tr className="cursor-default hover:bg-transparent">
                                    <Th>Theater Details</Th>
                                    <Th>Location</Th>
                                    <Th>Screens</Th>
                                    <Th>Seating Capacity</Th>
                                    <Th className="text-right">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredTheaters.map(theater => {
                                    const capacity = theater.screens.reduce((acc, s) => acc + (s.total_rows * s.seats_per_row), 0);
                                    return (
                                        <Tr key={theater.id} className="cursor-default hover:bg-[#1f1e1e]">
                                            <Td>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                                                        <Building2 className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-white text-base block">{theater.name}</span>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                            <MapPin className="w-3 h-3" /> ID: {theater.id.substring(0, 8)}...
                                                        </span>
                                                    </div>
                                                </div>
                                            </Td>
                                            <Td className="font-medium text-gray-300">{theater.location}</Td>
                                            <Td>
                                                <div className="flex flex-wrap max-w-md gap-1.5 py-1">
                                                    {theater.screens.length === 0 ? (
                                                        <span className="text-xs text-gray-500 italic">No screens added yet</span>
                                                    ) : (
                                                        theater.screens.map(screen => (
                                                            <span
                                                                key={screen.id}
                                                                className="px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 rounded-lg inline-flex items-center gap-1.5 group relative pr-7"
                                                                title={`Total seats: ${screen.total_rows * screen.seats_per_row} (${screen.total_rows} rows × ${screen.seats_per_row} seats)`}
                                                            >
                                                                <Film className="w-3 h-3 text-gray-500" />
                                                                {screen.name}
                                                                <span className="text-[10px] text-gray-500 font-medium">({screen.total_rows}x{screen.seats_per_row})</span>
                                                                
                                                                {/* Hover Action icons for screen */}
                                                                <span className="absolute right-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setEditScreen({ theaterId: theater.id, screen });
                                                                        }}
                                                                        className="text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
                                                                        title="Edit Screen"
                                                                    >
                                                                        <Edit2 className="w-2.5 h-2.5" />
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setDeleteScreenId(screen.id);
                                                                        }}
                                                                        className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer"
                                                                        title="Delete Screen"
                                                                    >
                                                                        <Trash2 className="w-2.5 h-2.5" />
                                                                    </button>
                                                                </span>
                                                            </span>
                                                        ))
                                                    )}
                                                </div>
                                            </Td>
                                            <Td className="font-bold text-gray-200">{capacity} seats</Td>
                                            <Td>
                                                <div className="flex justify-end items-center gap-3">
                                                    <Button
                                                        variant="secondary"
                                                        className="px-4 py-1.5 text-xs rounded-lg flex items-center gap-1 border border-white/10 hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/30 transition-all font-medium cursor-pointer"
                                                        icon={<PlusIcon className="w-3.5 h-3.5" />}
                                                        onClick={() => setAddScreenTheater(theater)}
                                                    >
                                                        Add Screen
                                                    </Button>
                                                    <button
                                                        onClick={() => setEditTheater(theater)}
                                                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Theater"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTheaterId(theater.id)}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Theater"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </Td>
                                        </Tr>
                                    );
                                })}
                            </Tbody>
                        </Table>
                    )}
                </section>
            </div>

            {/* Modal: Add Screen */}
            {addScreenTheater && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setAddScreenTheater(null)}>
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
                                onClick={() => {
                                    setAddScreenTheater(null);
                                    setScreenName("");
                                    setTotalRows(10);
                                    setSeatsPerRow(12);
                                    setScreenError("");
                                }}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddScreenSubmit} className="space-y-4">
                            {screenError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {screenError}
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
                                    disabled={createScreenMutation.isPending}
                                    onClick={() => {
                                        setAddScreenTheater(null);
                                        setScreenName("");
                                        setTotalRows(10);
                                        setSeatsPerRow(12);
                                        setScreenError("");
                                    }}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={createScreenMutation.isPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {createScreenMutation.isPending ? "Adding..." : "Add Screen"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Screen */}
            {editScreen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setEditScreen(null)}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Film className="text-blue-400 w-5 h-5" /> Edit Screen
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Screen: {editScreen.screen.name}</p>
                            </div>
                            <button
                                onClick={() => setEditScreen(null)}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditScreenSubmit} className="space-y-4">
                            {screenError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {screenError}
                                </div>
                            )}

                            <FormInput
                                label="Screen Name"
                                placeholder="e.g. Screen 1, IMAX"
                                value={editScreenName}
                                onChange={(e) => setEditScreenName(e.target.value)}
                                required
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormInput
                                    label="Total Rows"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={editTotalRows}
                                    onChange={(e) => setEditTotalRows(Math.max(1, Number(e.target.value)))}
                                    required
                                />
                                <FormInput
                                    label="Seats Per Row"
                                    type="number"
                                    min="1"
                                    max="50"
                                    value={editSeatsPerRow}
                                    onChange={(e) => setEditSeatsPerRow(Math.max(1, Number(e.target.value)))}
                                    required
                                />
                            </div>

                            <div className="pt-2 text-xs text-gray-500 flex justify-between bg-white/5 border border-white/5 p-3.5 rounded-xl">
                                <span>Calculated Capacity:</span>
                                <span className="font-bold text-white">{editTotalRows * editSeatsPerRow} seats</span>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    disabled={updateScreenMutation.isPending}
                                    onClick={() => setEditScreen(null)}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={updateScreenMutation.isPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {updateScreenMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Screen Confirmation */}
            {deleteScreenId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setDeleteScreenId(null)}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-2">Delete Screen</h3>
                        <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this screen? All associated seating and capacity data will be lost. This action cannot be undone.</p>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                            <button
                                type="button"
                                onClick={() => setDeleteScreenId(null)}
                                className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteScreenMutation.mutate(deleteScreenId)}
                                disabled={deleteScreenMutation.isPending}
                                className="px-6 py-2 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
                            >
                                {deleteScreenMutation.isPending ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Add Theater */}
            {showAddTheaterModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setShowAddTheaterModal(false)}>
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
                                onClick={() => {
                                    setShowAddTheaterModal(false);
                                    setTheaterName("");
                                    setTheaterLocation("");
                                    setTheaterError("");
                                }}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddTheaterSubmit} className="space-y-4">
                            {theaterError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {theaterError}
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
                                    disabled={createTheaterMutation.isPending}
                                    onClick={() => {
                                        setShowAddTheaterModal(false);
                                        setTheaterName("");
                                        setTheaterLocation("");
                                        setTheaterError("");
                                    }}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={createTheaterMutation.isPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {createTheaterMutation.isPending ? "Creating..." : "Create Theater"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Edit Theater */}
            {editTheater && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setEditTheater(null)}>
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
                                onClick={() => setEditTheater(null)}
                                className="p-1.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditTheaterSubmit} className="space-y-4">
                            {theaterError && (
                                <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
                                    {theaterError}
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
                                    disabled={updateTheaterMutation.isPending}
                                    onClick={() => setEditTheater(null)}
                                    className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    disabled={updateTheaterMutation.isPending}
                                    className="px-6 py-2 text-sm"
                                >
                                    {updateTheaterMutation.isPending ? "Saving..." : "Save Changes"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal: Delete Theater Confirmation */}
            {deleteTheaterId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in" onClick={() => setDeleteTheaterId(null)}>
                    <div 
                        className="bg-[#1A1A1A] border border-white/10 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden animate-scale-up"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-bold text-white mb-2">Delete Theater</h3>
                        <p className="text-sm text-gray-400 mb-6">Are you sure you want to delete this theater location? All screens and showtimes under this theater will be permanently removed. This action cannot be undone.</p>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                            <button
                                type="button"
                                onClick={() => setDeleteTheaterId(null)}
                                className="px-5 py-2 text-sm font-semibold rounded-full bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => deleteTheaterMutation.mutate(deleteTheaterId)}
                                disabled={deleteTheaterMutation.isPending}
                                className="px-6 py-2 text-sm font-semibold rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer transition-colors"
                            >
                                {deleteTheaterMutation.isPending ? "Deleting..." : "Confirm Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default TheatersTable;
