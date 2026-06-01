import FilterButton from "../Filter/FilterButton";
import FilterChip from "../Filter/FilterChip";

interface FilterOption {
  label: string;
  value: string;
}

interface CinemasFiltersProps {
  activeCity: string;
  activeFormat: string;
  cityOptions: FilterOption[];
  formatOptions: FilterOption[];
  setActiveCity: (city: string) => void;
  setActiveFormat: (format: string) => void;
}

const CinemasFilters = ({
  activeCity,
  activeFormat,
  cityOptions,
  formatOptions,
  setActiveCity,
  setActiveFormat,
}: CinemasFiltersProps) => {
  const hasActiveFilters = activeCity !== "all" || activeFormat !== "all";

  return (
    <aside className="w-full md:w-64 flex-shrink-0 md:sticky md:top-32 flex flex-col sm:flex-row md:flex-col gap-6 z-30 sm:items-start md:items-stretch">
      <h3 className="text-xl font-bold text-[#E5E2E1] w-full">Filters</h3>

      <div className="space-y-4 flex-1 w-full">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Screens Format
        </h3>
        <div className="flex flex-row md:flex-col gap-3 md:gap-2 items-start overflow-x-auto pb-1 w-full">
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

      <hr className="border-white/5 hidden md:block" />

      <div className="space-y-4 flex-1 w-full">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Cities
        </h3>
        <div className="flex flex-row md:flex-col gap-3 md:gap-2 items-start overflow-x-auto pb-1 w-full">
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

      {hasActiveFilters && (
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
  );
};

export default CinemasFilters;
