import { FILTER_CATEGORY_OPTIONS } from "../../constants/filter";
import FilterButton from "./FilterButton";

interface FilterMainProps {
    activeCategory: string;
    setActiveCategory: (filter: string) => void;
}

const Filter = ({ activeCategory, setActiveCategory }: FilterMainProps) => {

    return (
        <div className="flex flex-row gap-10">
            {FILTER_CATEGORY_OPTIONS.map((option) => (
                <FilterButton
                    key={option.value}
                    setValue={setActiveCategory}
                    option={option}
                    activeCategory={activeCategory}
                />
            ))}
        </div>
    )
}

export default Filter;