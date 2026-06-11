import { useState, useMemo, act } from "react";
import MovieCard from "./MovieCard";
import { useQuery } from "@tanstack/react-query";
import movieServices from "../../services/movieServices";
import type { Movie } from "../../types";
import LoadingState from "../LayoutElements/LoadingState";
import ErrorState from "../LayoutElements/ErrorState";
import FilterMain from "../Filter/FilterMain";
import { useNavigate } from "react-router";
import { ArrowRight, FilterIcon } from "lucide-react";

const MoviesList = ({ status = "now_showing" }: { status: "now_showing" | "coming_soon" }) => {
    const navigate = useNavigate();

    const [activeCategory, setActiveCategory] = useState("all");

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies-list", status],
        queryFn: () => movieServices.getAllMovies({ status, limit: 20 }),
    });

    const filteredMovies = useMemo(() => {
        switch (activeCategory) {
            case "new":
                return movies?.filter((movie) => new Date(movie.release_date) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
            case "kids":
                return movies?.filter((movie) => movie.age_rating <= 11);
            default:
                return movies;
        }
    }, [movies, activeCategory]);

    return (
        <section className="flex flex-col gap-5 sm:gap-8 md:gap-12 px-4 md:px-8 mb-6 sm:mb-12">
            <div className="flex flex-row items-center gap-6">
                <FilterIcon className="text-white w-6 h-6" />
                <FilterMain activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
            </div>
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl md:text-3xl lg:text-3xl font-bold text-[#E5E2E1] tracking-wide">
                    {status === "now_showing" ? "Now Playing" : "Coming Soon"}
                </h2>
                <button
                    onClick={() => navigate(`/movies?category=${status}`)}
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
                <div className="w-screen relative left-1/2 -translate-x-1/2 flex flex-row gap-3 sm:gap-6 overflow-x-auto scrollbar-none px-4 md:px-8 xl:px-[calc((100vw-1360px)/2+2rem)] pb-4 sm:pb-8">
                    {filteredMovies?.map((movie) => (
                        <MovieCard
                            onClick={() => navigate(`/movie/${movie.id}`)}
                            key={movie.id}
                            movie={movie}
                            main={true}
                        />
                    ))}
                </div>}
        </section>
    )
}

export default MoviesList;