import Button from "../../../components/Button";
import Tag from "../../../components/Tag";
import CinamaticHeroImage from "../../../assets/images/CinematicHeroImage.png"
import { Play, Ticket } from "lucide-react";

const Hero = () => {
    const mockTags = [{ type: "primary", text: "Sci-Fi" }, { type: "primary", text: "Action" }, { type: "primary", text: "2h 46m" }, { type: "secondary", text: "PG-13" }]

    return (
        <div className="relative w-full h-[70vh] overflow-hidden px-10 pb-20">
            <div className="absolute inset-0"
                style={{
                    backgroundImage: `url(${CinamaticHeroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0.35)_0%,_rgba(20,19,19,0.75)_50%,_rgba(20,19,19,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141313]/80 via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141313]/60 via-transparent to-transparent pointer-events-none" />
            <div className="h-full relative flex flex-col gap-2 justify-end items-start gap-8">
                <div className="text-left max-w-lg">
                    <h1 className="text-5xl font-bold text-white">
                        DUNE: PART TWO
                    </h1>

                    <p className="text-md 2xl:text-lg text-gray-300 leading-relaxed mt-4 max-w-3xl">
                        Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
                    </p>
                </div>

                <div className="flex flex-row gap-2">
                    {mockTags.map((tag, index) => (
                        <Tag key={index} variant={tag.type as "primary" | "secondary"}>{tag.text}</Tag>
                    ))}
                </div>

                <div className="flex flex-row gap-2">
                    <Button variant="primary">
                        <Ticket />
                        Book Now
                    </Button>
                    <Button variant="secondary">
                        <Play />
                        Watch Trailer
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Hero;