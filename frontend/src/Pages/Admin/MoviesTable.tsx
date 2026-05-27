import { useState, useMemo } from "react"
import movieServices from "../../services/movieServices"
import type { Movie } from "../../types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table"
import { Edit2, FilterIcon, PlusIcon, Trash2 } from "lucide-react"
import Button from "../../components/Elements/Button"
import SearchInput from "../../components/Filter/SearchInput"
import { useSearchParams, useNavigate } from "react-router"
import FilterButton from "../../components/Filter/FilterButton"

const MoviesTable = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [activeStatus, setActiveStatus] = useState(searchParams.get("status") || "all");

    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: movies, isLoading } = useQuery<Movie[]>({
        queryKey: ["movies", activeStatus],
        queryFn: () => movieServices.getAllMovies({
            status: activeStatus,
        })
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => movieServices.deleteMovie(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["movies"] });
            setDeletingId(null);
        }
    });

    const filteredMovies = useMemo(() => {
        if (!movies) return [];
        return movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [movies, search]);

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1">
            {/* Tabs Navigation */}
            <div className="flex gap-6 border-b border-gray-800/50 mt-6 mb-2">
                <button
                    onClick={() => navigate("/admin/movies-management")}
                    className="pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 border-blue-500 text-blue-400 cursor-pointer transition-all"
                >
                    Movies
                </button>
                <button
                    onClick={() => navigate("/admin/theaters-management")}
                    className="pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 border-transparent text-gray-500 hover:text-gray-300 cursor-pointer transition-all"
                >
                    Theaters
                </button>
            </div>

            <div className="sticky top-0 z-10 py-4 mb-6 mt-2 flex justify-between items-end bg-[#121111]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-200">Movies Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage and update the movie catalogue.</p>
                </div>
                <div className="flex items-center gap-4">
                    <SearchInput
                        placeholder="Search movies..."
                        value={search}
                        onChange={setSearch}
                    />
                    <Button
                        className="whitespace-nowrap"
                        variant="primary"
                        icon={<PlusIcon className="w-4 h-4" />}
                        onClick={() => navigate("/admin/movies-management/create")}
                    >
                        Add Movie
                    </Button>
                </div>
            </div>
            <div className="flex flex-row gap-6 text-white pb-8">
                <aside className="flex flex-col gap-4 p-6 w-64 shrink-0 h-fit bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl">
                    <h2 className="text-xl font-semibold text-blue-400 flex items-center gap-2"><FilterIcon />Filters</h2>
                    <div className="flex flex-col gap-2 items-start">
                        <FilterButton
                            option={{ label: "All", value: "all" }}
                            activeCategory={activeStatus}
                            setValue={setActiveStatus}
                        />
                        <FilterButton
                            option={{ label: "Now Showing", value: "now_showing" }}
                            activeCategory={activeStatus}
                            setValue={setActiveStatus}
                        />
                        <FilterButton
                            option={{ label: "Coming Soon", value: "coming_soon" }}
                            activeCategory={activeStatus}
                            setValue={setActiveStatus}
                        />
                    </div>
                </aside>
                <section className="flex-1 min-w-0">
                    {isLoading ? (
                        <div className="text-gray-500 animate-pulse">Loading movies...</div>
                    ) : (
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Title</Th>
                                    <Th>Status</Th>
                                    <Th>Created At</Th>
                                    <Th>Updated At</Th>
                                    <Th className="text-right">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {filteredMovies?.map(movie => (
                                    <Tr key={movie.id} onClick={() => navigate(`/admin/movies-management/${movie.id}`)}>
                                        <Td className="font-semibold text-white">{movie.title}</Td>
                                        <Td>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-md ${movie.status === 'now_showing'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                }`}>
                                                {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                                            </span>
                                        </Td>
                                        <Td>{new Date(movie.created_at || '').toLocaleDateString()}</Td>
                                        <Td>{new Date(movie.updated_at || '').toLocaleDateString()}</Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                {deletingId === movie.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteMutation.mutate(movie.id);
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                            className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-md transition-colors cursor-pointer"
                                                        >
                                                            {deleteMutation.isPending && deletingId === movie.id ? "Deleting..." : "Confirm"}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeletingId(null);
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                            className="px-2.5 py-1 text-xs font-semibold bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-200 rounded-md transition-colors cursor-pointer"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/admin/movies-management/${movie.id}/edit`);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                                            title="Edit Movie"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeletingId(movie.id);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                                            title="Delete Movie"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </section>
            </div>
        </main>
    )
}

export default MoviesTable