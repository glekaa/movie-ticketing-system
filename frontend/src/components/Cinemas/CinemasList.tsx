import { Building2 } from "lucide-react";
import CinemaCard from "./CinemaCard";
import type { Theater } from "../../types";

interface CinemasListProps {
  filteredCinemas: Theater[];
  search: string;
  activeCity: string;
  activeFormat: string;
  onResetFilters: () => void;
}

const CinemasList = ({
  filteredCinemas,
  search,
  activeCity,
  activeFormat,
  onResetFilters,
}: CinemasListProps) => {
  if (filteredCinemas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[#171616]/40 backdrop-blur-xl border border-white/5 rounded-3xl text-center w-full">
        <Building2 className="w-12 h-12 text-gray-600 mb-4" />
        <h3 className="text-white font-semibold text-lg">No Cinemas Found</h3>
        <p className="text-gray-500 text-sm mt-1 max-w-sm">
          Try clearing your search query or adjusting filters to discover other theatres.
        </p>
        {(search || activeCity !== "all" || activeFormat !== "all") && (
          <button
            onClick={onResetFilters}
            className="mt-5 px-4 py-2 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {filteredCinemas.map((cinema) => (
        <CinemaCard key={cinema.id} cinema={cinema} />
      ))}
    </div>
  );
};

export default CinemasList;
