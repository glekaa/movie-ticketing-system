import React, { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../../services/movieServices";
import Button from "../../components/Elements/Button";
import Tag from "../../components/Elements/Tag";
import { Table, Thead, Tbody, Tr, Th, Td } from "../../components/Admin/Table";
import LoadingState from "../../components/LayoutElements/LoadingState";
import type { Genre, Person, Showtime } from "../../types";

const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: movie, isLoading, isError } = useQuery({
        queryKey: ["adminMovie", id],
        queryFn: () => movieServices.getMovieById(id!),
        enabled: !!id,
    });

    const { data: showtimes, isLoading: isShowtimesLoading } = useQuery({
        queryKey: ["adminMovieShowtimes", id],
        queryFn: () => movieServices.getMovieShowtimes(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <LoadingState />
            </div>
        );
    }

    if (isError || !movie) {
        return (
            <div className="p-8 text-red-500 font-semibold bg-red-500/10 border border-red-500/20 rounded-xl m-8">
                Error loading movie details.
            </div>
        );
    }

    const handleCopyId = () => {
        navigator.clipboard.writeText(movie.id);
        // Optional: show a small toast here if available
    };

    return (
        <main className="p-6 lg:p-10 space-y-10 text-gray-200">
            {/* 1. The Action Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#1A1A1A] p-6 rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{movie.title}</h1>
                    <select
                        className="bg-[#222222] border border-gray-700 text-white rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500 cursor-pointer"
                        defaultValue={movie.status}
                    >
                        <option value="now_showing">Now Showing</option>
                        <option value="coming_soon">Coming Soon</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary">Edit Details</Button>
                    <Button
                        className="!bg-red-500/10 !text-red-500 hover:!bg-red-500 hover:!text-white border border-red-500/20"
                        variant="secondary"
                    >
                        Delete Movie
                    </Button>
                </div>
            </header>

            {/* 2. Media Preview Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <article className="relative group rounded-xl overflow-hidden border border-gray-800 shadow-xl aspect-[2/3] bg-[#111]">
                    <img src={movie.poster_url} alt={`${movie.title} Poster`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
                        <span className="text-xs text-gray-400 font-mono">500 x 750</span>
                        <Button variant="secondary">Update Poster</Button>
                    </div>
                </article>
                <article className="lg:col-span-2 relative group rounded-xl overflow-hidden border border-gray-800 shadow-xl aspect-video lg:aspect-auto bg-[#111]">
                    <img src={movie.backdrop_url} alt={`${movie.title} Backdrop`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
                        <span className="text-xs text-gray-400 font-mono">1280 x 720</span>
                        <Button variant="secondary">Update Backdrop</Button>
                    </div>
                </article>
            </section>

            {/* 3. Core Metadata Sheet */}
            <section className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Language</p>
                    <div className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label="language">
                            🗣️
                        </span>
                        <span className="font-semibold">{movie.language || "N/A"}</span>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Duration & Age</p>
                    <div className="flex items-center gap-2">
                        <Tag variant="secondary">{movie.duration_minutes} min</Tag>
                        <Tag variant="primary">{movie.age_rating}+</Tag>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Release Date</p>
                    <p className="font-semibold text-white">
                        {new Date(movie.release_date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">TMDB Rating</p>
                    <Tag className="!bg-yellow-500/10 !text-yellow-500 !border-yellow-500/20 font-semibold shadow-sm">
                        ⭐ {movie.tmdb_rating ? `${movie.tmdb_rating}/10` : "N/A"}
                    </Tag>
                </div>
            </section>

            {/* 4. Cast & Narrative Management */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <article className="space-y-6">
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl h-full space-y-5">
                        <h3 className="text-lg font-bold text-white">Narrative Overview</h3>
                        <div>
                            <h4 className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Description</h4>
                            <p className="text-sm text-gray-300 leading-relaxed">{movie.description}</p>
                        </div>
                        {movie.plot && (
                            <div>
                                <h4 className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Full Plot</h4>
                                <p className="text-sm text-gray-400 bg-[#151515] p-4 rounded-xl border border-gray-800 max-h-48 overflow-y-auto leading-relaxed">
                                    {movie.plot}
                                </p>
                            </div>
                        )}
                    </div>
                </article>

                <article className="space-y-6">
                    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl h-full space-y-6">
                        <div>
                            <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Genres</h4>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((g: Genre) => (
                                    <Tag key={g.id} variant="primary" className="cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                        {g.name}
                                    </Tag>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Director</h4>
                            <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-xl border border-gray-800 w-fit">
                                {movie.director?.profile_url ? (
                                    <img src={movie.director.profile_url} alt={movie.director.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                                        {movie.director?.name?.charAt(0) || "?"}
                                    </div>
                                )}
                                <span className="font-medium text-white">{movie.director?.name || "Unknown"}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Actors</h4>
                            <div className="flex flex-wrap gap-2">
                                {movie.actors?.map((actor: Person, idx: number) => (
                                    <div key={idx} className="flex items-center gap-2 bg-[#151515] pr-3 rounded-full border border-gray-800">
                                        {actor.profile_url ? (
                                            <img src={actor.profile_url} alt={actor.name} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                                {actor.name.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium">{actor.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </article>
            </section>

            {/* Admin Extra: Linked Showtimes */}
            <section className="space-y-4 pt-4">
                <h3 className="text-xl font-bold text-white px-2">Active Showtimes</h3>
                {isShowtimesLoading ? (
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
                            {showtimes.map((st: Showtime & { screen?: { name: string; theater?: { name: string } } }) => {
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

            {/* 5. The "System Logs" Footprint */}
            <footer className="pt-8 mt-12 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-3">
                    <span className="font-semibold uppercase tracking-wider text-gray-600">UUID</span>
                    <code className="bg-[#111] px-3 py-1.5 rounded-md text-gray-400 border border-gray-800 select-all font-mono">
                        {movie.id}
                    </code>
                    <button
                        onClick={handleCopyId}
                        className="p-1.5 hover:bg-gray-800 hover:text-white rounded transition-colors"
                        title="Copy ID to clipboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/>
                        </svg>
                    </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 bg-[#111] px-4 py-2 rounded-lg border border-gray-800">
                    <div>
                        <span className="text-gray-600 mr-2">Created:</span>
                        <span className="font-mono">{new Date(movie.created_at).toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-gray-600 mr-2">Last Modified:</span>
                        <span className="font-mono">{new Date(movie.updated_at).toLocaleString()}</span>
                    </div>
                </div>
            </footer>
        </main>
    );
};

export default MovieDetails;