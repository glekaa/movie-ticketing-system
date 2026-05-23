import Hero from "../../components/Hero";
import MoviesList from "../../components/MoviesList";

const Movies = ({ status = "now_showing" }: { status?: "now_showing" | "coming_soon" }) => {
    return (
        <>
            <Hero status={status} />
            <MoviesList status={status} />
        </>
    )
}

export default Movies;