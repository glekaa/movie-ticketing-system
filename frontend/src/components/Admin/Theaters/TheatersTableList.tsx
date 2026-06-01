import { Table, Thead, Tbody, Tr, Th, Td } from "../Table";
import { MapPin, Film, Edit2, PlusIcon } from "lucide-react";
import Button from "../../Elements/Button";
import type { Theater } from "../../../types";

interface TheatersTableListProps {
    theaters: Theater[];
    onAddScreen: (theater: Theater) => void;
    onEditTheater: (theater: Theater) => void;
}

export const TheatersTableList = ({
    theaters,
    onAddScreen,
    onEditTheater,
}: TheatersTableListProps) => {
    return (
        <Table>
            <Thead>
                <Tr className="cursor-default hover:bg-transparent">
                    <Th>Theater Details</Th>
                    <Th>Location</Th>
                    <Th>Screens</Th>
                    <Th>Capacity</Th>
                    <Th className="text-right">Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {theaters.map((theater) => {
                    const capacity = theater.screens.reduce(
                        (acc, s) => acc + s.total_rows * s.seats_per_row,
                        0
                    );
                    return (
                        <Tr key={theater.id} className="cursor-default hover:bg-[#1f1e1e]">
                            <Td>
                                <div className="flex items-center gap-3">
                                    <div>
                                        <span className="font-semibold text-white text-base block">
                                            {theater.name}
                                        </span>
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
                                        <span className="text-xs text-gray-500 italic">
                                            No screens added yet
                                        </span>
                                    ) : (
                                        theater.screens.map((screen) => (
                                            <span
                                                key={screen.id}
                                                className="px-2.5 py-1 text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 rounded-lg inline-flex items-center gap-1.5"
                                                title={`Total seats: ${screen.total_rows * screen.seats_per_row
                                                    } (${screen.total_rows} rows × ${screen.seats_per_row} seats)`}
                                            >
                                                <Film className="w-3 h-3 text-gray-500" />
                                                {screen.name}
                                                <span className="text-[10px] text-gray-500 font-medium">
                                                    ({screen.total_rows}x{screen.seats_per_row})
                                                </span>
                                            </span>
                                        ))
                                    )}
                                </div>
                            </Td>
                            <Td className="font-bold text-gray-200">{capacity} seats</Td>
                            <Td className="flex items-center gap-2">
                                <Button
                                    variant="secondary"
                                    className="text-xs "
                                    icon={<PlusIcon className="w-3.5 h-3.5" />}
                                    onClick={() => onAddScreen(theater)}
                                >
                                    Add Screen
                                </Button>
                                <button
                                    onClick={() => onEditTheater(theater)}
                                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors cursor-pointer"
                                    title="Edit Theater"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </Td>
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};

export default TheatersTableList;
