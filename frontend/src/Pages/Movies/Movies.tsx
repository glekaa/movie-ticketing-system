import Hero from "../../components/Hero";
import MoviesListMain from "../../components/MoviesListMain";

const Movies = ({ status = "now_showing" }: { status?: "now_showing" | "coming_soon" }) => {
    return (
        <>
            <Hero status={status} />
            <MoviesListMain status={status} />
        </>
    )
}

export default Movies;