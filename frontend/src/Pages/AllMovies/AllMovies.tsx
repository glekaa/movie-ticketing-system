import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import movieServices from "../../services/movieServices";
import MovieCard from "../../components/Movies/MovieCard";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import { FILTER_GENRE_OPTIONS, FILTER_AGE_OPTIONS } from "../../constants/filter";
import type { Movie } from "../../types";
import { FilterDropdown } from "../../components/Filter/FilterDropdown";
import { FilterChip } from "../../components/Filter/FilterChip";
import { SearchInput } from "../../components/Filter/SearchInput";
import FilterButton from "../../components/Filter/FilterButton";

const AllMovies = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<number[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("category") || "all");

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies", { selectedGenres, activeCategory }],
        queryFn: () => movieServices.getAllMovies({
            genres: selectedGenres,
            status: activeCategory
        })
    });

    const filteredMovies = useMemo(() => {
        if (!movies) return [];

        return movies.filter((movie) => {
            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());

            const matchesAge = selectedAges.length === 0 ||
                selectedAges.some(selected => {
                    const optionIndex = FILTER_AGE_OPTIONS.findIndex(opt => opt.value === selected);
                    if (optionIndex !== -1 && optionIndex < FILTER_AGE_OPTIONS.length - 1) {
                        const nextOptionValue = FILTER_AGE_OPTIONS[optionIndex + 1].value;
                        return movie.age_rating >= selected && movie.age_rating < nextOptionValue;
                    }
                    return movie.age_rating >= selected;
                });

            return matchesSearch && matchesAge;
        });
    }, [movies, search, selectedAges]);

    const toggleGenre = (genreValue: string) => {
        setSelectedGenres(prev =>
            prev.includes(genreValue)
                ? prev.filter(g => g !== genreValue)
                : [...prev, genreValue]
        );
    };

    const toggleAge = (ageValue: number) => {
        setSelectedAges(prev =>
            prev.includes(ageValue)
                ? prev.filter(a => a !== ageValue)
                : [...prev, ageValue]
        );
    };

    const availableGenres = FILTER_GENRE_OPTIONS.filter(g => g.value !== "all");

    return (
        <div className="flex flex-col px-4 md:px-8 mb-12 min-h-screen mt-8 relative">

            {/* Top Sticky Header: Title & Search */}
            <div className="sticky top-0 bg-[#141313] z-40 py-6 mb-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E5E2E1] tracking-wide">
                    All Movies
                </h2>

                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search movies..."
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative">

                {/* Left Sidebar - Sticky Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 flex flex-col gap-6 z-30">
                    <h3 className="text-xl font-bold text-[#E5E2E1]">Filters</h3>

                    <div className="flex flex-col gap-2 items-start">
                        <FilterButton
                            option={{ value: "all", label: "All" }}
                            activeCategory={activeCategory}
                            setValue={setActiveCategory}
                        />
                        <FilterButton
                            option={{ value: "now_showing", label: "Now Playing" }}
                            activeCategory={activeCategory}
                            setValue={setActiveCategory}
                        />
                        <FilterButton
                            option={{ value: "coming_soon", label: "Coming Soon" }}
                            activeCategory={activeCategory}
                            setValue={setActiveCategory}
                        />
                    </div>

                    {/* Genre Dropdown */}
                    <FilterDropdown
                        title="Genres"
                        options={availableGenres}
                        selectedValues={selectedGenres}
                        onToggle={toggleGenre}
                    />

                    {/* Age Category Dropdown */}
                    <FilterDropdown
                        title="Age Category"
                        options={FILTER_AGE_OPTIONS as any}
                        selectedValues={selectedAges}
                        onToggle={toggleAge}
                    />

                    {/* Selected Filters Chips */}
                    {(selectedGenres.length > 0 || selectedAges.length > 0) && (
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex flex-wrap gap-2">
                                {selectedGenres.map(genre => {
                                    const label = FILTER_GENRE_OPTIONS.find(g => g.value === genre)?.label;
                                    return (
                                        <FilterChip
                                            key={genre}
                                            label={label || genre}
                                            onRemove={() => toggleGenre(genre)}
                                        />
                                    );
                                })}
                                {selectedAges.map(age => {
                                    const label = FILTER_AGE_OPTIONS.find(a => a.value === age)?.value;
                                    return (
                                        <FilterChip
                                            key={age}
                                            label={`Age: ${label}`}
                                            onRemove={() => toggleAge(age)}
                                            className="bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] shadow-[0_8px_20px_-4px_rgba(139,92,246,0.5)] hover:shadow-[0_0px_25px_rgba(139,92,246,0.7)]"
                                        />
                                    );
                                })}
                            </div>
                            <button
                                className="text-sm text-gray-400 hover:text-white text-left underline decoration-white/30 underline-offset-4"
                                onClick={() => {
                                    setSelectedGenres([]);
                                    setSelectedAges([]);
                                }}
                            >
                                Clear All
                            </button>
                        </div>
                    )}
                </aside>

                {/* Main Content - Grid */}
                <main className="flex-1 flex flex-col relative w-full">
                    {isLoading ? (
                        <LoadingState message="Loading movies..." />
                    ) : isError ? (
                        <ErrorState message="Error loading movies." />
                    ) : filteredMovies.length === 0 ? (
                        <div className="text-gray-400 mt-8 text-center text-lg w-full">No movies found matching your criteria.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                            {filteredMovies.map((movie) => (
                                <MovieCard
                                    onClick={() => navigate(`/movie/${movie.id}`)}
                                    key={movie.id}
                                    movie={movie}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default AllMovies;
