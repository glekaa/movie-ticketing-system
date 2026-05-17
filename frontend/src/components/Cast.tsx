import CastMember from "./CastMember";
import { Users } from "lucide-react";

const Cast = () => {
    return (
        <section>
            <h2 className="text-2xl font-bold mb-6">Top Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <CastMember 
                    imageUrl="https://cdn.britannica.com/11/215011-050-3127A07E/American-actor-Keanu-Reeves-2014.jpg?w=300" 
                    name="Keanu Reeves" 
                    role="as Neo" 
                />
                <CastMember 
                    imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Carrie-Anne_Moss_May_2016.jpg/960px-Carrie-Anne_Moss_May_2016.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail" 
                    name="Carrie-Anne Moss" 
                    role="as Trinity" 
                />
                <CastMember 
                    imageUrl="https://cdn.britannica.com/93/223293-050-28BCE441/American-actor-Laurence-Fishburne-2017.jpg" 
                    name="Laurence Fishburne" 
                    role="as Morpheus" 
                />
                {/* View Full Cast Card */}
                <button className="relative group overflow-hidden rounded-xl bg-[#141313] aspect-[2/3] flex flex-col items-center justify-center gap-3 hover:bg-[#1a1a1a] transition-colors cursor-pointer border border-white/5 hover:border-white/10">
                    <Users className="w-8 h-8 text-[#8B8D8D] group-hover:text-white transition-colors" />
                    <span className="text-[#C4C7C7] text-sm font-medium group-hover:text-white transition-colors">View Full Cast</span>
                </button>
            </div>
        </section>
    );
};

export default Cast;
