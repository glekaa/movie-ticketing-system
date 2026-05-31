import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import theaterServices from "../../services/theaterServices";
import type { Theater } from "../../types";
import CinemaCard from "../../components/Cinemas/CinemaCard";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import { SearchInput } from "../../components/Filter/SearchInput";
import FilterButton from "../../components/Filter/FilterButton";
import FilterChip from "../../components/Filter/FilterChip";
import { Building2 } from "lucide-react";

// Mock fallbacks of major real cinemas across Poland for a complete experience if the DB is empty
export const MOCK_CINEMAS: Theater[] = [
  {
    id: "mock-warsaw-arkadia",
    name: "Cinema City Westfield Arkadia",
    location: "Warsaw, Jana Pawła II 82",
    screens: [
      { id: "s-wa-1", name: "Screen 1 - IMAX 3D", total_rows: 15, seats_per_row: 20 },
      { id: "s-wa-2", name: "Screen 2 - Laser Room", total_rows: 12, seats_per_row: 16 },
      { id: "s-wa-3", name: "Screen 3", total_rows: 10, seats_per_row: 14 },
      { id: "s-wa-4", name: "Screen 4", total_rows: 10, seats_per_row: 14 },
    ],
  },
  {
    id: "mock-krakow-bonarka",
    name: "Cinema City Bonarka",
    location: "Kraków, Kamieńskiego 11",
    screens: [
      { id: "s-kb-1", name: "Screen 1 - IMAX 3D", total_rows: 18, seats_per_row: 22 },
      { id: "s-kb-2", name: "Screen 2 - Laser Projection", total_rows: 14, seats_per_row: 18 },
      { id: "s-kb-3", name: "Screen 3", total_rows: 12, seats_per_row: 15 },
    ],
  },
  {
    id: "mock-gdansk-forum",
    name: "Helios Forum Gdańsk",
    location: "Gdańsk, Targ Sienny 7",
    screens: [
      { id: "s-gf-1", name: "Screen 1 - Laser 4K", total_rows: 10, seats_per_row: 15 },
      { id: "s-gf-2", name: "Screen 2", total_rows: 10, seats_per_row: 12 },
      { id: "s-gf-3", name: "Screen 3", total_rows: 8, seats_per_row: 10 },
    ],
  },
  {
    id: "mock-wroclaw-wroclavia",
    name: "Cinema City Wroclavia",
    location: "Wrocław, Sucha 1",
    screens: [
      { id: "s-ww-1", name: "Screen 1 - IMAX 3D", total_rows: 16, seats_per_row: 20 },
      { id: "s-ww-2", name: "Screen 2 - Laser 4K", total_rows: 12, seats_per_row: 16 },
      { id: "s-ww-3", name: "Screen 3", total_rows: 10, seats_per_row: 14 },
    ],
  },
  {
    id: "mock-poznan-51",
    name: "Multikino Poznań 51",
    location: "Poznań, Królowej Jadwigi 51",
    screens: [
      { id: "s-p5-1", name: "Screen 1 - Laser Projector", total_rows: 12, seats_per_row: 18 },
      { id: "s-p5-2", name: "Screen 2", total_rows: 10, seats_per_row: 14 },
    ],
  },
  {
    id: "mock-lodz-sukcesja",
    name: "Helios Łódź Sukcesja",
    location: "Łódź, Politechniki 1",
    screens: [
      { id: "s-ls-1", name: "Screen 1 - Laser 4K", total_rows: 14, seats_per_row: 16 },
      { id: "s-ls-2", name: "Screen 2", total_rows: 10, seats_per_row: 12 },
    ],
  },
  {
    id: "mock-katowice-silesia",
    name: "Cinema City Silesia",
    location: "Katowice, Chorzowska 107",
    screens: [
      { id: "s-cs-1", name: "Screen 1 - IMAX 3D", total_rows: 15, seats_per_row: 20 },
      { id: "s-cs-2", name: "Screen 2", total_rows: 12, seats_per_row: 16 },
    ],
  },
];

const getCityFromLocation = (location: string): string => {
  const parts = location.split(/,|-|\s+/);
  for (const part of parts) {
    const clean = part.trim().replace(/[.,]/g, "");
    const lower = clean.toLowerCase();
    if (lower.includes("warszaw") || lower.includes("warsaw")) return "Warsaw";
    if (lower.includes("krakow") || lower.includes("kraków")) return "Kraków";
    if (lower.includes("gdańsk") || lower.includes("gdansk")) return "Gdańsk";
    if (lower.includes("wrocław") || lower.includes("wroclaw")) return "Wrocław";
    if (lower.includes("poznan") || lower.includes("poznań")) return "Poznań";
    if (lower.includes("łódź") || lower.includes("lodz")) return "Łódź";
    if (lower.includes("katowic")) return "Katowice";
    if (lower.includes("szczecin")) return "Szczecin";
    if (lower.includes("bydgoszcz")) return "Bydgoszcz";
    if (lower.includes("lublin")) return "Lublin";
    if (lower.includes("białystok") || lower.includes("bialystok")) return "Białystok";
    if (lower.includes("rzeszów") || lower.includes("rzeszow")) return "Rzeszów";
    if (lower.includes("gdynia")) return "Gdynia";
    if (lower.includes("sopot")) return "Sopot";
    if (lower.includes("toruń") || lower.includes("torun")) return "Toruń";
  }
  return location.split(",")[0].trim();
};

const Cinemas = () => {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [activeFormat, setActiveFormat] = useState<string>("all");

  // Fetch theaters via TanStack Query
  const { data: dbTheaters, isLoading, isError } = useQuery<Theater[]>({
    queryKey: ["theaters"],
    queryFn: () => theaterServices.getAllTheaters(),
  });

  // Use DB data if present, otherwise fall back to MOCK list
  const allCinemas = useMemo(() => {
    return dbTheaters && dbTheaters.length > 0 ? dbTheaters : MOCK_CINEMAS;
  }, [dbTheaters]);

  // Derive unique cities
  const cityOptions = useMemo(() => {
    const list = new Set<string>();
    allCinemas.forEach((cinema) => {
      const city = getCityFromLocation(cinema.location);
      if (city) list.add(city);
    });
    const sorted = Array.from(list).sort();
    return [
      { label: "All Cities", value: "all" },
      ...sorted.map((c) => ({ label: c, value: c })),
    ];
  }, [allCinemas]);

  // Filter options for screen formats
  const formatOptions = [
    { label: "All Formats", value: "all" },
    { label: "IMAX®", value: "imax" },
    { label: "Laser", value: "laser" },
  ];

  // Filtering Logic
  const filteredCinemas = useMemo(() => {
    return allCinemas.filter((cinema) => {
      // 1. Search Query
      const matchesSearch =
        cinema.name.toLowerCase().includes(search.toLowerCase()) ||
        cinema.location.toLowerCase().includes(search.toLowerCase());

      // 2. City
      const city = getCityFromLocation(cinema.location);
      const matchesCity = activeCity === "all" || city === activeCity;

      // 3. Screen Format
      const hasIMAX = cinema.screens.some((s) => s.name.toLowerCase().includes("imax"));
      const hasLaser = cinema.screens.some((s) => s.name.toLowerCase().includes("laser"));

      let matchesFormat = true;
      if (activeFormat === "imax") matchesFormat = hasIMAX;
      else if (activeFormat === "laser") matchesFormat = hasLaser;

      return matchesSearch && matchesCity && matchesFormat;
    });
  }, [allCinemas, search, activeCity, activeFormat]);

  if (isLoading) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <LoadingState message="Loading cinemas..." />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <ErrorState message="Could not load cinema data." />
      </main>
    );
  }

  return (
    <main className="flex flex-col px-4 md:px-8 mb-16 min-h-screen mt-8 relative max-w-7xl mx-auto w-full animate-fade-in">
      {/* Top Sticky Header: Title & Search */}
      <section className="sticky top-0 bg-[#141313] z-40 py-6 mb-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#E5E2E1] tracking-wide">
            Our Cinemas
          </h1>
          <p className="text-sm text-gray-400 mt-1 max-w-xl">
            Locate available screens and find our theaters across Poland.
          </p>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name or address..."
          className="sm:w-80"
        />
      </section>

      {/* Main Layout: Sticky Sidebar Filters + Cinemas List */}
      <div className="flex flex-col md:flex-row gap-10 items-start relative">
        {/* Left Sidebar - Sticky Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 flex flex-col gap-6 z-30">
          <h3 className="text-xl font-bold text-[#E5E2E1]">Filters</h3>

          {/* Format Categories using FilterButton */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Screens Format
            </h3>
            <div className="flex flex-col gap-2 items-start">
              {formatOptions.map((opt) => (
                <FilterButton
                  key={opt.value}
                  option={opt}
                  activeCategory={activeFormat}
                  setValue={setActiveFormat}
                />
              ))}
            </div>
          </div>

          <hr className="border-white/5" />

          {/* City Filters using FilterButton */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Cities
            </h3>
            <div className="flex flex-col gap-2 items-start">
              {cityOptions.map((opt) => (
                <FilterButton
                  key={opt.value}
                  option={opt}
                  activeCategory={activeCity}
                  setValue={setActiveCity}
                />
              ))}
            </div>
          </div>

          {/* Selected Filters Chips */}
          {(activeCity !== "all" || activeFormat !== "all") && (
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex flex-wrap gap-2">
                {activeFormat !== "all" && (
                  <FilterChip
                    label={activeFormat === "imax" ? "IMAX®" : "Laser"}
                    onRemove={() => setActiveFormat("all")}
                  />
                )}
                {activeCity !== "all" && (
                  <FilterChip
                    label={activeCity}
                    onRemove={() => setActiveCity("all")}
                  />
                )}
              </div>
              <button
                className="text-sm text-gray-400 hover:text-white text-left underline decoration-white/30 underline-offset-4 cursor-pointer"
                onClick={() => {
                  setActiveCity("all");
                  setActiveFormat("all");
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </aside>

        {/* Right Section - Cinemas List */}
        <section className="flex-1 flex flex-col gap-5 w-full">
          {filteredCinemas.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 bg-[#171616]/40 backdrop-blur-xl border border-white/5 rounded-3xl text-center">
              <Building2 className="w-12 h-12 text-gray-600 mb-4" />
              <h3 className="text-white font-semibold text-lg">No Cinemas Found</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-sm">
                Try clearing your search query or adjusting filters to discover other theatres.
              </p>
              {(search || activeCity !== "all" || activeFormat !== "all") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCity("all");
                    setActiveFormat("all");
                  }}
                  className="mt-5 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 w-full">
              {filteredCinemas.map((cinema) => (
                <CinemaCard key={cinema.id} cinema={cinema} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Cinemas;
