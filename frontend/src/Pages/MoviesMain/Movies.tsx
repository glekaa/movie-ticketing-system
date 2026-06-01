import Hero from "../../components/Movies/Hero";
import MoviesList from "../../components/Movies/MoviesList";

const Movies = ({ status = "now_showing" }: { status?: "now_showing" | "coming_soon" }) => {
    return (
        <main className="pb-12">
            <Hero status={status} />
            <MoviesList status={status} />
        </main>
    )
}

export default Movies;