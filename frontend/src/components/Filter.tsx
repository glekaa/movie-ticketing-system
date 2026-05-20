import { FILTER_CATEGORY_OPTIONS } from "../constants/filter";
import { useState } from "react";

const Filter = () => {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
        <div className="flex flex-row gap-10">
            {FILTER_CATEGORY_OPTIONS.map((option) => (
                <button
                    key={option.value}
                    onClick={() => setActiveCategory(option.value)}
                    className={`text-2xl font-extrabold cursor-pointer hover:text-white ${activeCategory === option.value ? "text-white" : "text-white/60 "}`}>
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export default Filter;