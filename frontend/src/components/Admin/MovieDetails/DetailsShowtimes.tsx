import { Table, Thead, Tbody, Tr, Th, Td } from "../Table";
import Tag from "../../Elements/Tag";
import LoadingState from "../../LayoutElements/LoadingState";
import type { Showtime } from "../../../types";

interface DetailsShowtimesProps {
    showtimes: (Showtime & { screen?: { name: string; theater?: { name: string } } })[] | undefined;
    isLoading: boolean;
}

const DetailsShowtimes = ({ showtimes, isLoading }: DetailsShowtimesProps) => {
    return (
        <section className="space-y-4 pt-4">
            <h3 className="text-xl font-bold text-white px-2">Active Showtimes</h3>
            {isLoading ? (
                <div className="p-8 flex justify-center bg-[#1A1A1A] rounded-2xl border border-gray-800">
                    <LoadingState />
                </div>
            ) : showtimes && showtimes.length > 0 ? (
                <Table>
                    <Thead>
                        <Tr>
                            <Th>Theater Branch</Th>
                            <Th>Screen</Th>
                            <Th>Date</Th>
                            <Th>Time</Th>
                            <Th>Price</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {showtimes.map((st) => {
                            const stDate = new Date(st.start_time);
                            return (
                                <Tr key={st.id}>
                                    <Td>{st.screen?.theater?.name || "Unknown Theater"}</Td>
                                    <Td>{st.screen?.name || "Unknown Screen"}</Td>
                                    <Td>{stDate.toLocaleDateString()}</Td>
                                    <Td>{stDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Td>
                                    <Td className="font-mono text-green-400">${st.base_price}</Td>
                                    <Td>
                                        <Tag variant={st.status === "active" ? "primary" : "secondary"}>{st.status}</Tag>
                                    </Td>
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            ) : (
                <div className="bg-[#1A1A1A] p-10 rounded-2xl border border-gray-800 text-center text-gray-500 shadow-xl">
                    <p className="text-lg mb-2">No active showtimes</p>
                    <p className="text-sm">This movie is not currently scheduled to play at any theater.</p>
                </div>
            )}
        </section>
    );
};

export default DetailsShowtimes;
