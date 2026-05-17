import type { Movie } from "../types";

interface SynopsisProps {
    movie: Movie;
}

const Synopsis = ({ movie }: SynopsisProps) => {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-[#C4C7C7] leading-relaxed text-md max-w-3xl">
                {movie.description}
            </p>
            <div className="flex flex-row gap-10 mt-6 py-4">
                <div className="bg-white/5 rounded-lg px-4 py-3 min-w-[120px] border border-white/5">
                    <p className="text-[#8B8D8D] text-[10px] uppercase tracking-wider mb-1">Director</p>
                    <p className="font-medium text-sm text-[#E5E2E1]">Unknown</p>
                </div>
                <div className="bg-white/5 rounded-lg px-4 py-3 min-w-[200px] border border-white/5">
                    <p className="text-[#8B8D8D] text-[10px] uppercase tracking-wider mb-1">Writers</p>
                    <p className="font-medium text-sm text-[#E5E2E1]">Unknown</p>
                </div>
            </div>
        </section>
    );
};

export default Synopsis;
