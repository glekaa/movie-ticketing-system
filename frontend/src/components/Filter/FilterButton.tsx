interface FilterButtonProps {
    setValue: (value: string) => void;
    option: { value: string, label: string };
    activeCategory: string;
}

const FilterButton = ({ setValue, option, activeCategory }: FilterButtonProps) => {
    return (
        <button
            onClick={() => setValue(option.value)}
            className={`text-sm sm:text-base md:text-lg lg:text-2xl font-extrabold cursor-pointer hover:text-white whitespace-nowrap ${activeCategory === option.value ? "text-white" : "text-white/60 "}`}>
            {option.label}
        </button>
    )
}

export default FilterButton;