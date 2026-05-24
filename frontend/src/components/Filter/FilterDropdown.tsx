import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Button from "../Elements/Button";

export interface FilterOption<T> {
    label: string;
    value: T;
}

interface FilterDropdownProps<T> {
    title: string;
    options: FilterOption<T>[];
    selectedValues: T[];
    onToggle: (value: T) => void;
}

export const FilterDropdown = <T extends string | number>({
    title,
    options,
    selectedValues,
    onToggle,
}: FilterDropdownProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="secondary"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full justify-between"
            >
                {title}
                {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </Button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#222222] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-xl">
                    <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {options.map((option) => (
                            <button
                                key={String(option.value)}
                                className="w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 text-gray-200 flex items-center justify-between cursor-pointer"
                                onClick={() => onToggle(option.value)}
                            >
                                {option.label}
                                {selectedValues.includes(option.value) && (
                                    <div className="w-2 h-2 rounded-full bg-[#00A3FF]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
