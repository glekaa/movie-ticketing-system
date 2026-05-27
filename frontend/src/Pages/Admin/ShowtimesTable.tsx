import { useState } from "react"
import showtimeServices from "../../services/showtimeServices"
import movieServices from "../../services/movieServices"
import theaterServices from "../../services/theaterServices"
import type { Showtime, Movie, Theater } from "../../types"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table"
import { PlusIcon, Trash2 } from "lucide-react"
import Button from "../../components/Elements/Button"
import { useNavigate } from "react-router"

const ShowtimesTable = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery<Showtime[]>({
        queryKey: ["showtimes"],
        queryFn: () => showtimeServices.getAllShowtimes()
    })

    const { data: movies } = useQuery<Movie[]>({
        queryKey: ["movies"],
        queryFn: () => movieServices.getAllMovies()
    })

    const { data: theaters } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters()
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => showtimeServices.deleteShowtime(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["showtimes"] });
            setDeletingId(null);
        }
    });

    const getMovieTitle = (id: string) => {
        return movies?.find(m => m.id === id)?.title || id;
    }

    const getScreenName = (id: string) => {
        if (!theaters) return id;
        for (const theater of theaters) {
            const screen = theater.screens.find(s => s.id === id);
            if (screen) {
                return `${theater.name} - ${screen.name}`;
            }
        }
        return id;
    }

    return (
        <main className="flex flex-col px-4 md:px-8 flex-1">
            <div className="sticky top-0 z-10 py-4 mb-6 mt-4 flex justify-between items-end bg-[#121111]">
                <div>
                    <h1 className="text-3xl font-bold text-gray-200">Showtimes Management</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage and update the showtimes.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        className="whitespace-nowrap"
                        variant="primary"
                        icon={<PlusIcon className="w-4 h-4" />}
                        onClick={() => navigate("/admin/showtimes-management/create")}
                    >
                        Create Showtime
                    </Button>
                </div>
            </div>
            <div className="flex flex-row gap-6 text-white pb-8">
                <section className="flex-1 min-w-0">
                    {isLoadingShowtimes ? (
                        <div className="text-gray-500 animate-pulse">Loading showtimes...</div>
                    ) : (
                        <Table>
                            <Thead>
                                <Tr>
                                    <Th>Movie</Th>
                                    <Th>Screen</Th>
                                    <Th>Start Time</Th>
                                    <Th>End Time</Th>
                                    <Th>Price</Th>
                                    <Th>Status</Th>
                                    <Th className="text-right">Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {showtimes?.map(showtime => (
                                    <Tr key={showtime.id}>
                                        <Td className="font-semibold text-white">{getMovieTitle(showtime.movie_id)}</Td>
                                        <Td>{getScreenName(showtime.screen_id)}</Td>
                                        <Td>{new Date(showtime.start_time).toLocaleString()}</Td>
                                        <Td>{new Date(showtime.end_time).toLocaleString()}</Td>
                                        <Td>${showtime.base_price}</Td>
                                        <Td>
                                            <span className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                {showtime.status}
                                            </span>
                                        </Td>
                                        <Td>
                                            <div className="flex justify-end items-center gap-3">
                                                {deletingId === showtime.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteMutation.mutate(showtime.id);
                                                            }}
                                                            disabled={deleteMutation.isPending}
                                                            className="px-2.5 py-1 text-xs font-semibold bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white rounded-md transition-colors cursor-pointer"
                                                        >
                                                            {deleteMutation.isPending && deletingId === showtime.id ? "Deleting..." : "Confirm"}
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
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeletingId(showtime.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                                        title="Delete Showtime"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
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

export default ShowtimesTable;
