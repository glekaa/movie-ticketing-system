import { Search } from "lucide-react";

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const SearchInput = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}: SearchInputProps) => {
    return (
        <div className={`flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full max-w-md bg-white/5 backdrop-blur-md ${className}`}>
            <Search className="text-gray-400 mr-2 w-5 h-5" />
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent outline-none text-white w-full placeholder-gray-400"
            />
        </div>
    );
};

export default SearchInput;
