import { useState, useMemo } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from "../Table";
import SearchInput from "../../Filter/SearchInput";
import { Tag as TagIcon } from "lucide-react";
import type { Genre } from "../../../types";

interface GenresTableListProps {
    genres: Genre[];
}

export const GenresTableList = ({ genres }: GenresTableListProps) => {
    const [search, setSearch] = useState("");

    const filteredGenres = useMemo(() => {
        return genres.filter(g =>
            g.name.toLowerCase().includes(search.toLowerCase()) ||
            g.slug.toLowerCase().includes(search.toLowerCase())
        );
    }, [genres, search]);

    return (
        <div className="lg:col-span-2 bg-[#1a1919] border border-white/5 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold font-['Montserrat']">Available Genres</h2>
                    <p className="text-xs text-gray-400">List of all active genres and search helper</p>
                </div>

                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search genres..."
                    className="w-full sm:w-64"
                />
            </div>

            {filteredGenres.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-[#121111] border border-white/5 rounded-xl">
                    <TagIcon className="w-10 h-10 text-gray-600 mb-3" />
                    <h3 className="text-white font-semibold text-sm">No Genres Found</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {search ? "Try searching for a different term." : "Create a new genre to get started."}
                    </p>
                </div>
            ) : (
                <Table>
                    <Thead>
                        <Tr className="cursor-default hover:bg-transparent">
                            <Th className="w-12 text-center">#</Th>
                            <Th>Genre Name</Th>
                            <Th>URL Slug</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {filteredGenres.map((genre, idx) => (
                            <Tr key={genre.id} className="cursor-default hover:bg-[#1f1e1e]">
                                <Td className="text-center text-xs text-gray-500 font-mono">
                                    {idx + 1}
                                </Td>
                                <Td className="font-semibold text-white">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        {genre.name}
                                    </div>
                                </Td>
                                <Td className="text-xs font-mono text-gray-400">
                                    {genre.slug}
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
        </div>
    );
};

export default GenresTableList;
