import { useState, useMemo } from "react"
import movieServices from "../../services/movieServices"
import type { Movie } from "../../types"
import { useQuery } from "@tanstack/react-query"
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table"
import { Edit2, Trash2 } from "lucide-react"
import SearchInput from "../../components/Filter/SearchInput"
import { useSearchParams, useNavigate } from "react-router"
import FilterButton from "../../components/Filter/FilterButton"

const MoviesTable = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const [activeStatus, setActiveStatus] = useState(searchParams.get("status") || "all");

    const { data: movies, isLoading } = useQuery<Movie[]>({
        queryKey: ["movies", activeStatus],
        queryFn: () => movieServices.getAllMovies({
            status: activeStatus,
        })
    })

    const filteredMovies = useMemo(() => {
        if (!movies) return [];
        return movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [movies, search]);

    return (
        <div className="flex flex-col px-4 md:px-8 flex-1">
            <div className="sticky top-0 z-10 py-4 mb-6 mt-4 flex justify-between items-end bg-[#121111]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-200">Movies Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage and update the movie catalogue.</p>
                </div>
                <SearchInput
                    placeholder="Search movies..."
                    value={search}
                    onChange={setSearch}
                />
            </div>
            <div className="flex flex-row gap-6 text-white pb-8">
                <aside className="flex flex-col gap-4 p-6 w-64 shrink-0 h-fit bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl">
                    <h2 className="text-xl font-semibold text-gray-200">Filters</h2>
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
                <main className="flex-1 min-w-0">
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
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                                    title="Edit Movie"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete Movie"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    )}
                </main>
            </div>
        </div>
    )
}

export default MoviesTable