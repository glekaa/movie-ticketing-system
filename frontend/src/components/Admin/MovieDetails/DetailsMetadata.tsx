import Tag from "../../Elements/Tag";

interface DetailsMetadataProps {
    language: string | null;
    durationMinutes: number;
    ageRating: number;
    releaseDate: string;
    tmdbRating: number | null;
}

const DetailsMetadata = ({ language, durationMinutes, ageRating, releaseDate, tmdbRating }: DetailsMetadataProps) => {
    return (
        <section className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Language</p>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">{language || "N/A"}</span>
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Duration & Age</p>
                <div className="flex items-center gap-2">
                    <Tag variant="secondary">{durationMinutes} min</Tag>
                    <Tag variant="primary">{ageRating}+</Tag>
                </div>
            </div>
            <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Release Date</p>
                <p className="font-semibold text-white">
                    {new Date(releaseDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    })}
                </p>
            </div>
            <div>
                <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">TMDB Rating</p>
                <Tag className="!bg-yellow-500/10 !text-yellow-500 !border-yellow-500/20 font-semibold shadow-sm">
                    {tmdbRating ? `${tmdbRating}/10` : "N/A"}
                </Tag>
            </div>
        </section>
    );
};

export default DetailsMetadata;
