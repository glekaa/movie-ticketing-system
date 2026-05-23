import type { Movie } from "../types";
import { Clapperboard, Languages } from "lucide-react";

interface SynopsisProps {
    movie: Movie;
}

const Synopsis = ({ movie }: SynopsisProps) => {
    // Use plot from OMDB if available, otherwise fall back to description
    const synopsisText = movie.plot || movie.description;

    const metaItems = [
        { label: "Director", value: movie.director?.name, icon: <Clapperboard className="w-3.5 h-3.5" /> },
        { label: "Language", value: movie.language, icon: <Languages className="w-3.5 h-3.5" /> },
    ].filter(item => item.value);

    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-[#C4C7C7] leading-relaxed text-md max-w-3xl">
                {synopsisText}
            </p>
            <div className="w-fit">
                <div className="flex flex-row flex-wrap gap-4 mt-6 py-4">
                    {metaItems.map(item => (
                        <div key={item.label} className="bg-[#141313] rounded-lg px-4 py-3 min-w-[120px] border border-white/5">
                            <p className="text-[#8B8D8D] text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                {item.icon}
                                {item.label}
                            </p>
                            <p className="font-medium text-sm text-[#E5E2E1]">{item.value}</p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Synopsis;
