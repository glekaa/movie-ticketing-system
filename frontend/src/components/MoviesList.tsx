import { useState, useMemo } from "react";
import MovieCard from "./MovieCard";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../services/movieServices";
import type { Movie } from "../types";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import Filter from "./Filter";
import { useNavigate } from "react-router";

interface MovieListProps {
    status: "now_showing" | "coming_soon";
}

const MoviesList = ({ status }: MovieListProps) => {
    const queryFn = status === "now_showing" ? movieServices.getNowPlayingMovies : movieServices.getUpcomingMovies;
    const navigate = useNavigate();

    const [filtersActive, setFiltersActive] = useState("all");
    const [search, setSearch] = useState("");

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies", status],
        queryFn,
    });

    const filteredMovies = useMemo(() => {
        if (!movies) return [];

        const searchedMovies = movies.filter((movie) =>
            movie.title.toLowerCase().includes(search.toLowerCase())
        );

        return searchedMovies;
    }, [movies, search, filtersActive]);

    return (
        <div className="flex flex-col gap-8 md:gap-12 px-4 md:px-8 mb-12">
            <Filter
                filtersActive={filtersActive}
                setFiltersActive={setFiltersActive}
                search={search}
                setSearch={setSearch}
            />
            <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#E5E2E1] tracking-wide">
                {status === "now_showing" ? "Now Playing" : "Coming Soon"}
            </h2>
            {isLoading ? (
                <LoadingState message="Loading movies" />
            ) : isError ? (
                <ErrorState message="Error loading movies" />
            ) :
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
                    {filteredMovies?.map((movie) => (
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