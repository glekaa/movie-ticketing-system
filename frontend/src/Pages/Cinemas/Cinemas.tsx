import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import theaterServices from "../../services/theaterServices";
import type { Theater } from "../../types";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import SearchInput from "../../components/Filter/SearchInput";
import CinemasFilters from "../../components/Cinemas/CinemasFilters";
import CinemasList from "../../components/Cinemas/CinemasList";
import { getCityFromLocation } from "../../utils";

const Cinemas = () => {
  const [search, setSearch] = useState("");
  const [activeCity, setActiveCity] = useState<string>("all");
  const [activeFormat, setActiveFormat] = useState<string>("all");

  const { data: allCinemas, isLoading, isError } = useQuery<Theater[]>({
    queryKey: ["theaters"],
    queryFn: () => theaterServices.getAllTheaters(),
  });

  const cityOptions = useMemo(() => {
    if (!allCinemas) return [{ label: "All Cities", value: "all" }];
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

  const formatOptions = [
    { label: "All Formats", value: "all" },
    { label: "IMAX®", value: "imax" },
    { label: "Laser", value: "laser" },
  ];

  const filteredCinemas = useMemo(() => {
    if (!allCinemas) return [];
    return allCinemas.filter((cinema) => {
      const matchesSearch =
        cinema.name.toLowerCase().includes(search.toLowerCase()) ||
        cinema.location.toLowerCase().includes(search.toLowerCase());

      const city = getCityFromLocation(cinema.location);
      const matchesCity = activeCity === "all" || city === activeCity;

      const screens = cinema.screens || [];
      const hasIMAX = screens.some((s) => s.name?.toLowerCase().includes("imax"));
      const hasLaser = screens.some((s) => s.name?.toLowerCase().includes("laser"));

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

  const handleResetFilters = () => {
    setSearch("");
    setActiveCity("all");
    setActiveFormat("all");
  };

  return (
    <main className="flex flex-col px-4 md:px-8 mb-16 min-h-screen mt-8 relative max-w-7xl mx-auto w-full animate-fade-in">
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

      <div className="flex flex-col md:flex-row gap-10 items-start relative">
        <CinemasFilters
          activeCity={activeCity}
          activeFormat={activeFormat}
          cityOptions={cityOptions}
          formatOptions={formatOptions}
          setActiveCity={setActiveCity}
          setActiveFormat={setActiveFormat}
        />

        <section className="flex-1 flex flex-col gap-5 w-full">
          <CinemasList
            filteredCinemas={filteredCinemas}
            search={search}
            activeCity={activeCity}
            activeFormat={activeFormat}
            onResetFilters={handleResetFilters}
          />
        </section>
      </div>
    </main>
  );
};

export default Cinemas;
