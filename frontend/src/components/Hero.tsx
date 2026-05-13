import CinamaticHeroImage from ".././assets/images/CinematicHeroImage.png"

export default function Hero() {
    return (
        <div className="relative w-full h-[90vh] overflow-hidden px-10 pb-20">
            <div className="absolute inset-0 z-[-1]"
                style={{
                    backgroundImage: `url(${CinamaticHeroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0.35)_0%,_rgba(20,19,19,0.75)_50%,_rgba(20,19,19,1)_100%)] pointer-events-none" />
            <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-[#141313]/80 via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#141313]/60 via-transparent to-transparent pointer-events-none" />
            <div className="h-full relative flex flex-col gap-2 justify-end items-start gap-8">
                <div className="text-left max-w-lg">
                    <h1 className="text-2xl md:text-5xl lg:text-6xl 2xl:text-8xl font-bold text-white">
                        DUNE: PART TWO
                    </h1>

                    <p className="text-lg 2xl:text-xl text-gray-300 leading-relaxed mt-4 max-w-3xl">
                        Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.
                    </p>
                </div>

                <div className="flex flex-row gap-2">
                    <span>Sci-Fi</span>
                    <span>Action</span>
                    <span className="text-sm flex flex-row items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        2h 46m
                    </span>
                </div>

                <div className="flex flex-row gap-2">
                    <button>
                        Book Now
                    </button>
                    <button>
                        Watch Trailer
                    </button>
                </div>
            </div>
        </div>
    )
}