import { FILTER_CATEGORY_OPTIONS } from "../constants/filter";
import { useState } from "react";
import FilterButton from "./FilterButton";

const Filter = () => {
    const [activeCategory, setActiveCategory] = useState("all");

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