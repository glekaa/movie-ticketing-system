import { User } from "lucide-react";
import type { Movie } from "../../types";

interface CastProps {
    movie: Movie;
}

const Cast = ({ movie }: CastProps) => {
    const actors = movie.actors || [];

    if (actors.length === 0) {
        return null;
    }

    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                {actors.map((actor, index) => (
                    <div
                        key={index}
                        className="flex flex-col bg-[#141313] rounded-xl overflow-hidden border border-white/5"
                    >
                        <div className="aspect-[4/5] w-full bg-[#1a1a1a] relative">
                            {actor.profile_url ? (
                                <img src={actor.profile_url} alt={actor.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User className="w-10 h-10 text-[#8B8D8D]" />
                                </div>
                            )}
                        </div>
                        <div className="p-4 flex flex-col">
                            <span className="font-bold text-[#E5E2E1] truncate">{actor.name}</span>
                            {actor.character && <span className="text-xs text-[#8B8D8D] mt-0.5 truncate">as {actor.character}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Cast;
