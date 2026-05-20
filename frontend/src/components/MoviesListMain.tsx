import { useState, useMemo } from "react";
import MovieCard from "./MovieCard";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../services/movieServices";
import type { Movie } from "../types";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import Filter from "./Filter";
import { useNavigate } from "react-router";
import { ArrowRight, FilterIcon } from "lucide-react";

interface MovieListProps {
    status: "now_showing" | "coming_soon";
}

const MoviesList = ({ status }: MovieListProps) => {
    const queryFn = status === "now_showing" ? movieServices.getNowPlayingMovies : movieServices.getUpcomingMovies;
    const navigate = useNavigate();

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies", status],
        queryFn,
    });

    return (
        <div className="flex flex-col gap-8 md:gap-12 px-4 md:px-8 mb-12">
            <div className="flex flex-row items-center gap-6">
                <FilterIcon className="text-white w-6 h-6" />
                <Filter />
            </div>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#E5E2E1] tracking-wide">
                    {status === "now_showing" ? "Now Playing" : "Coming Soon"}
                </h2>
                <button
                    onClick={() => navigate(`/`)}
                    className="text-base md:text-lg lg:text-xl text-blue-400 cursor-pointer hover:text-white flex items-center gap-2">
                    <span>See All</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
            {isLoading ? (
                <LoadingState message="Loading movies" />
            ) : isError ? (
                <ErrorState message="Error loading movies" />
            ) :
                <div className="w-screen relative left-1/2 -translate-x-1/2 flex flex-row gap-6 overflow-x-auto px-4 md:px-8 xl:px-[calc((100vw-1360px)/2+2rem)] pb-8">
                    {movies?.map((movie) => (
                        <MovieCard
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            key={movie.id}
                            movie={movie}
                        />
                    ))}
                </div>}
        </div>
    )
}

export default MoviesList;