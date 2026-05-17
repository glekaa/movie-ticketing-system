import { User } from "lucide-react";
import type { Movie } from "../types";

interface CastProps {
    movie: Movie;
}

const Cast = ({ movie }: CastProps) => {
    // Parse comma-separated actors string from OMDB API
    const actorNames = movie.actors
        ? movie.actors.split(",").map(name => name.trim()).filter(Boolean)
        : [];

    if (actorNames.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
            <div className="flex flex-row flex-wrap gap-3">
                {actorNames.map((name) => (
                    <div
                        key={name}
                        className="flex items-center gap-3 bg-[#141313] rounded-lg px-4 py-3 border border-white/5"
                    >
                        <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <User className="w-4 h-4 text-[#8B8D8D]" />
                        </div>
                        <span className="font-medium text-sm text-[#E5E2E1]">{name}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Cast;
