import Tag from "./Tag";
import TheMatrixImage from "../../../assets/images/the-matrix.png"
import TheMatrixPoster from "../../../assets/images/the-matrix-poster.png"
import { Play, Star } from "lucide-react";
import Button from "./Button";

const MovieHero = () => {
    const mockTags = [{ type: "primary", text: "Sci-Fi / Thriller" }, { type: "primary", text: "142 min" }, { type: "secondary", text: "16+" }]

    return (
        <div className="relative w-full h-[80vh] overflow-hidden px-6 md:px-10 pb-20 pt-32">
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `url(${TheMatrixImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            {/* Gradients to blend background into header and footer */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0)_0%,_rgba(20,19,19,0.2)_60%,_rgba(20,19,19,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            
            <div className="h-full max-w-7xl mx-auto relative flex flex-row items-end gap-10">
                {/* Poster */}
                <div className="w-40 md:w-56 shrink-0 hidden sm:block shadow-[0_0_40px_rgba(0,0,0,0.8)] rounded-2xl border border-white/10 overflow-hidden">
                    <img src={TheMatrixPoster} alt="Movie Poster" className="w-full h-auto block" />
                </div>
                
                {/* Info */}
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex flex-row gap-2">
                        {mockTags.map((tag, index) => (
                            <Tag key={index} variant={tag.type as "primary" | "secondary"}>{tag.text}</Tag>
                        ))}
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white tracking-wider">
                        THE MATRIX
                    </h1>
                    
                    <div className="flex flex-row items-center gap-6 mt-2">
                        <div className="flex items-center gap-2 text-white font-semibold">
                            <Star />
                            <span className="text-xl">8.4 <span className="text-gray-400 text-sm">/ 10</span></span>
                        </div>
                        <Button icon={<Play />} className="py-3 text-sm" variant="secondary">Watch Trailer</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MovieHero;
