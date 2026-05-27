import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import theaterServices from "../../services/theaterServices";
import type { Theater } from "../../types";
import { FilterIcon, PlusIcon, Building2 } from "lucide-react";
import Button from "../../components/Elements/Button";
import SearchInput from "../../components/Filter/SearchInput";
import FilterDropdown from "../../components/Filter/FilterDropdown";
import TheatersStats from "../../components/Admin/Theaters/TheatersStats";
import TheatersTableList from "../../components/Admin/Theaters/TheatersTableList";
import TheatersModals from "../../components/Admin/Theaters/TheatersModals";
import AdminTabs from "../../components/Admin/AdminTabs";

const TheatersTable = () => {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [activeLocation, setActiveLocation] = useState("all");

    // Modal states
    const [addScreenTheater, setAddScreenTheater] = useState<Theater | null>(null);
    const [showAddTheaterModal, setShowAddTheaterModal] = useState(false);
    const [editTheater, setEditTheater] = useState<Theater | null>(null);

    // Error states
    const [screenError, setScreenError] = useState("");
    const [theaterError, setTheaterError] = useState("");

    // Fetch Theaters
    const { data: theaters, isLoading } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters(),
    });

    // Mutations
    const createTheaterMutation = useMutation({
        mutationFn: (data: { name: string; location: string }) => theaterServices.createTheater(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setShowAddTheaterModal(false);
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

    const createScreenMutation = useMutation({
        mutationFn: ({ theaterId, data }: { theaterId: string; data: { name: string; total_rows: number; seats_per_row: number } }) =>
            theaterServices.createScreen(theaterId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["theaters"] });
            setAddScreenTheater(null);
            setScreenError("");
        },
        onError: (err: any) => {
            setScreenError(err.response?.data?.detail || "Failed to add screen. Please try again.");
        }
    });

    // Extract unique locations for the filter
    const locations = useMemo(() => {
        if (!theaters) return [];
        const unique = new Set(theaters.map(t => t.location));
        return Array.from(unique).sort();
    }, [theaters]);

    // Build location options for the FilterDropdown
    const locationOptions = useMemo(() => {
        const list = [{ label: "All Locations", value: "all" }];
        locations.forEach(loc => {
            list.push({ label: loc, value: loc });
        });
        return list;
    }, [locations]);

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

    // Action execution wrappers with client-side validation
    const handleCreateScreen = (theaterId: string, data: { name: string; total_rows: number; seats_per_row: number }) => {
        if (!data.name.trim()) {
            setScreenError("Screen name is required.");
            return;
        }
        if (data.total_rows <= 0 || data.seats_per_row <= 0) {
            setScreenError("Rows and Seats per row must be positive numbers.");
            return;
        }
        createScreenMutation.mutate({ theaterId, data });
    };

    const handleCreateTheater = (data: { name: string; location: string }) => {
        if (!data.name.trim() || !data.location.trim()) {
            setTheaterError("All fields are required.");
            return;
        }
        createTheaterMutation.mutate(data);
    };

    const handleUpdateTheater = (theaterId: string, data: { name: string; location: string }) => {
        if (!data.name.trim() || !data.location.trim()) {
            setTheaterError("All fields are required.");
            return;
        }
        updateTheaterMutation.mutate({ id: theaterId, data });
    };

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1">
            {/* Tabs Navigation */}
            <AdminTabs activeTab="theaters" />

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
                        <FilterDropdown
                            title={activeLocation === "all" ? "All Locations" : activeLocation}
                            options={locationOptions}
                            selectedValues={[activeLocation]}
                            onToggle={(value) => setActiveLocation(value)}
                        />
                    </section>

                    <hr className="border-gray-800" />

                    <TheatersStats
                        totalTheaters={stats.totalTheaters}
                        totalScreens={stats.totalScreens}
                        totalCapacity={stats.totalCapacity}
                    />
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
                        <TheatersTableList
                            theaters={filteredTheaters}
                            onAddScreen={(theater) => setAddScreenTheater(theater)}
                            onEditTheater={(theater) => setEditTheater(theater)}
                        />
                    )}
                </section>
            </div>

            {/* Modals Container */}
            <TheatersModals
                addScreenTheater={addScreenTheater}
                onCloseAddScreen={() => { setAddScreenTheater(null); setScreenError(""); }}
                onCreateScreen={handleCreateScreen}
                createScreenPending={createScreenMutation.isPending}
                createScreenError={screenError}

                showAddTheaterModal={showAddTheaterModal}
                onCloseAddTheater={() => { setShowAddTheaterModal(false); setTheaterError(""); }}
                onCreateTheater={handleCreateTheater}
                createTheaterPending={createTheaterMutation.isPending}
                createTheaterError={theaterError}

                editTheater={editTheater}
                onCloseEditTheater={() => { setEditTheater(null); setTheaterError(""); }}
                onUpdateTheater={handleUpdateTheater}
                updateTheaterPending={updateTheaterMutation.isPending}
                updateTheaterError={theaterError}
            />
        </main>
    );
};

export default TheatersTable;