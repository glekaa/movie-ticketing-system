import Tag from "../../Elements/Tag";
import type { Genre, Person } from "../../../types";

interface DetailsNarrativeProps {
    description: string;
    plot: string | null;
    genres: Genre[];
    director: Person | null;
    actors: Person[] | null;
}

const DetailsNarrative = ({ description, plot, genres, director, actors }: DetailsNarrativeProps) => {
    return (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <article className="space-y-6">
                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl h-full space-y-5">
                    <h3 className="text-lg font-bold text-white">Narrative Overview</h3>
                    <div>
                        <h4 className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Description</h4>
                        <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
                    </div>
                    {plot && (
                        <div>
                            <h4 className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Full Plot</h4>
                            <p className="text-sm text-gray-400 bg-[#151515] p-4 rounded-xl border border-gray-800 max-h-48 overflow-y-auto leading-relaxed">
                                {plot}
                            </p>
                        </div>
                    )}
                </div>
            </article>

            <article className="space-y-6">
                <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-gray-800 shadow-xl h-full space-y-6">
                    <div>
                        <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Genres</h4>
                        <div className="flex flex-wrap gap-2">
                            {genres?.map((g: Genre) => (
                                <Tag key={g.id} variant="primary" className="cursor-pointer hover:bg-[#2A2A2A] transition-colors">
                                    {g.name}
                                </Tag>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Director</h4>
                        <div className="flex items-center gap-3 p-3 bg-[#151515] rounded-xl border border-gray-800 w-fit">
                            {director?.profile_url ? (
                                <img src={director.profile_url} alt={director.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-400">
                                    {director?.name?.charAt(0) || "?"}
                                </div>
                            )}
                            <span className="font-medium text-white">{director?.name || "Unknown"}</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs text-gray-500 mb-2 font-semibold uppercase tracking-wider">Actors</h4>
                        <div className="flex flex-wrap gap-2">
                            {actors?.map((actor: Person, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-[#151515] pr-3 rounded-full border border-gray-800">
                                    {actor.profile_url ? (
                                        <img src={actor.profile_url} alt={actor.name} className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                                            {actor.name.charAt(0)}
                                        </div>
                                    )}
                                    <span className="text-sm font-medium">{actor.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>
        </section>
    );
};

export default DetailsNarrative;
