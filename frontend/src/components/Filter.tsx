import { FILTER_DATE_OPTIONS } from "../constants/filter";
import Button from "./Button";
import { FilterIcon, Search } from "lucide-react";

interface FilterProps {
    filtersActive: string;
    setFiltersActive: (filtersActive: string) => void;
    search: string;
    setSearch: (search: string) => void;
}

const Filter = ({ filtersActive, setFiltersActive, search, setSearch }: FilterProps) => {

    return (
        <div className="flex justify-between">
            {FILTER_DATE_OPTIONS.map((option) => (
                <Button
                    key={option.value}
                    variant={filtersActive === option.value ? "primary" : "secondary"}
                    onClick={() => setFiltersActive(option.value)}>
                    {option.label}
                </Button>
            ))}
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <Search className="text-gray-500 mr-2" />
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none text-white w-full"
                />
            </div>
            <Button
                variant={"secondary"} >
                <FilterIcon />
                All Filters
            </Button>
        </div >
    )
}

export default Filter;