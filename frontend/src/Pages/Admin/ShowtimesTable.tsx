import showtimeServices from "../../services/showtimeServices"
import type { Showtime } from "../../types"
import { useQuery } from "@tanstack/react-query"
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table"
import { PlusIcon } from "lucide-react"
import Button from "../../components/Elements/Button"
import { useNavigate } from "react-router"

const ShowtimesTable = ({ movieID }: { movieID: string }) => {
    const navigate = useNavigate();

    const { data: showtimes, isLoading: isLoadingShowtimes } = useQuery<Showtime[]>({
        queryKey: ["showtimes", movieID],
        queryFn: () => showtimeServices.getMovieShowtimes(movieID)
    });

    return (
        <section className="space-y-4 pt-4">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-bold text-white">Active Showtimes</h3>
                <Button
                    className="whitespace-nowrap text-xs py-2 px-4"
                    variant="primary"
                    icon={<PlusIcon className="w-3.5 h-3.5" />}
                    onClick={() => navigate(`/admin/movies-management/${movieID}/showtime/create`)}
                >
                    Create Showtime
                </Button>
            </div>

            <div className="min-w-0">
                {isLoadingShowtimes ? (
                    <div className="text-gray-500 animate-pulse px-2">Loading showtimes...</div>
                ) : !showtimes || showtimes.length === 0 ? (
                    <div className="bg-[#1A1A1A] p-10 rounded-2xl border border-gray-800 text-center text-gray-500 shadow-xl">
                        <p className="text-lg mb-2">No active showtimes</p>
                        <p className="text-sm">This movie is not currently scheduled to play at any screen.</p>
                    </div>
                ) : (
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>Screen ID</Th>
                                <Th>Start Time</Th>
                                <Th>End Time</Th>
                                <Th>Price</Th>
                                <Th>Status</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {showtimes.map(showtime => (
                                <Tr key={showtime.id}>
                                    <Td>{showtime.screen_id}</Td>
                                    <Td>{new Date(showtime.start_time).toLocaleString()}</Td>
                                    <Td>{new Date(showtime.end_time).toLocaleString()}</Td>
                                    <Td className="font-mono text-green-400">${showtime.base_price}</Td>
                                    <Td>
                                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                                            showtime.status === 'active' || showtime.status === 'scheduled'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                        }`}>
                                            {showtime.status}
                                        </span>
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                )}
            </div>
        </section>
    );
};

export default ShowtimesTable;
