interface HeroOverlayProps {
    /** Controls the radial gradient darkness. "subtle" is lighter (for MovieHero), "strong" is darker (for Hero carousel). */
    variant?: "subtle" | "strong";
}

const HeroOverlay = ({ variant = "strong" }: HeroOverlayProps) => {
    const radial = variant === "strong"
        ? "bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0.2)_0%,_rgba(20,19,19,0.3)_50%,_rgba(20,19,19,0.6)_100%)]"
        : "bg-[radial-gradient(ellipse_at_center,_rgba(20,19,19,0)_0%,_rgba(20,19,19,0.2)_60%,_rgba(20,19,19,1)_100%)]";

    return (
        <>
            <div className={`absolute inset-0 ${radial} pointer-events-none`} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#141313] via-[#141313]/20 to-transparent pointer-events-none" />
        </>
    );
};

export default HeroOverlay;
