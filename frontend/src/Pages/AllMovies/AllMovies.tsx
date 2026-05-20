import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronDown, ChevronUp, X } from "lucide-react";
import { useNavigate } from "react-router";
import movieServices from "../../services/movieServices";
import MovieCard from "../../components/MovieCard";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import Button from "../../components/Button";
import { FILTER_GENRE_OPTIONS, FILTER_AGE_OPTIONS } from "../../constants/filter";
import type { Movie } from "../../types";

const AllMovies = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedAges, setSelectedAges] = useState<string[]>([]);
    
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    const [isAgeOpen, setIsAgeOpen] = useState(false);

    const genreRef = useRef<HTMLDivElement>(null);
    const ageRef = useRef<HTMLDivElement>(null);

    const { data: movies, isLoading, isError } = useQuery<Movie[]>({
        queryKey: ["movies", "all"],
        queryFn: movieServices.getAllMovies,
    });

    const filteredMovies = useMemo(() => {
        if (!movies) return [];

        return movies.filter((movie) => {
            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase());
            
            const matchesGenre = selectedGenres.length === 0 || 
                selectedGenres.some(selected => movie.genres.some(g => g.name.toLowerCase() === selected.toLowerCase()));
            
            const matchesAge = selectedAges.length === 0 ||
                (movie.age_rating && selectedAges.includes(movie.age_rating));

            return matchesSearch && matchesGenre && matchesAge;
        });
    }, [movies, search, selectedGenres, selectedAges]);

    const toggleGenre = (genreValue: string) => {
        setSelectedGenres(prev => 
            prev.includes(genreValue)
                ? prev.filter(g => g !== genreValue)
                : [...prev, genreValue]
        );
    };

    const toggleAge = (ageValue: string) => {
        setSelectedAges(prev => 
            prev.includes(ageValue)
                ? prev.filter(a => a !== ageValue)
                : [...prev, ageValue]
        );
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (genreRef.current && !genreRef.current.contains(event.target as Node)) {
                setIsGenreOpen(false);
            }
            if (ageRef.current && !ageRef.current.contains(event.target as Node)) {
                setIsAgeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const availableGenres = FILTER_GENRE_OPTIONS.filter(g => g.value !== "all");

    return (
        <div className="flex flex-col px-4 md:px-8 mb-12 min-h-screen mt-8 relative">
            
            {/* Top Sticky Header: Title & Search */}
            <div className="sticky top-0 bg-[#141313] z-40 py-6 mb-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#E5E2E1] tracking-wide">
                    All Movies
                </h2>
                
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md bg-white/5 backdrop-blur-md">
                    <Search className="text-gray-400 mr-2 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-transparent outline-none text-white w-full placeholder-gray-400"
                    />
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start relative">
                
                {/* Left Sidebar - Sticky Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 sticky top-32 flex flex-col gap-6 z-30">
                    <h3 className="text-xl font-bold text-[#E5E2E1]">Filters</h3>

                    {/* Genre Dropdown */}
                    <div className="relative" ref={genreRef}>
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsGenreOpen(!isGenreOpen)}
                            className="w-full justify-between"
                        >
                            Genres
                            {isGenreOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>

                        {isGenreOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-[#222222] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-xl">
                                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                    {availableGenres.map((option) => (
                                        <button
                                            key={option.value}
                                            className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 text-gray-200 flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleGenre(option.value)}
                                        >
                                            {option.label}
                                            {selectedGenres.includes(option.value) && (
                                                <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Age Category Dropdown */}
                    <div className="relative" ref={ageRef}>
                        <Button 
                            variant="secondary" 
                            onClick={() => setIsAgeOpen(!isAgeOpen)}
                            className="w-full justify-between"
                        >
                            Age Category
                            {isAgeOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </Button>

                        {isAgeOpen && (
                            <div className="absolute top-full left-0 mt-2 w-full bg-[#222222] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-xl">
                                <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                    {FILTER_AGE_OPTIONS.map((option) => (
                                        <button
                                            key={option.value}
                                            className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 text-gray-200 flex items-center justify-between cursor-pointer"
                                            onClick={() => toggleAge(option.value)}
                                        >
                                            {option.label}
                                            {selectedAges.includes(option.value) && (
                                                <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Selected Filters Chips */}
                    {(selectedGenres.length > 0 || selectedAges.length > 0) && (
                        <div className="flex flex-col gap-3 mt-2">
                            <div className="flex flex-wrap gap-2">
                                {selectedGenres.map(genre => {
                                    const label = FILTER_GENRE_OPTIONS.find(g => g.value === genre)?.label;
                                    return (
                                        <Button 
                                            key={genre} 
                                            variant="primary"
                                            onClick={() => toggleGenre(genre)}
                                            className="!py-1.5 !px-3 !text-xs flex items-center gap-1.5 w-auto"
                                        >
                                            {label}
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
                                    );
                                })}
                                {selectedAges.map(age => {
                                    const label = FILTER_AGE_OPTIONS.find(a => a.value === age)?.value; 
                                    return (
                                        <Button 
                                            key={age} 
                                            variant="primary"
                                            onClick={() => toggleAge(age)}
                                            className="!py-1.5 !px-3 !text-xs flex items-center gap-1.5 w-auto bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] shadow-[0_8px_20px_-4px_rgba(139,92,246,0.5)] hover:shadow-[0_0px_25px_rgba(139,92,246,0.7)]"
                                        >
                                            Age: {label}
                                            <X className="w-3.5 h-3.5" />
                                        </Button>
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
