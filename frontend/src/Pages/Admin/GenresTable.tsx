import { useQuery } from "@tanstack/react-query";
import genresServices from "../../services/genresServices";
import type { Genre } from "../../types";
import AdminTabs from "../../components/Admin/AdminTabs";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import GenresTableList from "../../components/Admin/Genres/GenresTableList";
import GenreAddForm from "../../components/Admin/Genres/GenreAddForm";

const GenresTable = () => {
    const { data: genres, isLoading, isError } = useQuery<Genre[]>({
        queryKey: ["genres"],
        queryFn: () => genresServices.getAllGenres(),
    });

    if (isLoading) {
        return (
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-white min-h-screen">
                <LoadingState message="Loading genres..." />
            </main>
        );
    }

    if (isError) {
        return (
            <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 text-white min-h-screen">
                <ErrorState message="Could not load genres data." />
            </main>
        );
    }

    return (
        <main className="flex flex-col px-4 md:px-8 lg:px-12 xl:px-16 text-white min-h-screen">

            <AdminTabs activeTab="genres" />
            <div className="mt-2 py-4">
                <h1 className="text-3xl font-bold font-['Montserrat'] tracking-wide">Genres Management</h1>
                <p className="text-xs text-gray-400 mt-1">Manage movie categories</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 items-start">
                {/* Display form on top on mobile/tablet, but on the right (order-2) on desktop */}
                <div className="lg:order-2 lg:col-span-1 w-full">
                    <GenreAddForm />
                </div>
                {/* Display list below form on mobile/tablet, but on the left (order-1) on desktop */}
                <div className="lg:order-1 lg:col-span-2 w-full">
                    <GenresTableList genres={genres || []} />
                </div>
            </div>
        </main>
    );
};

export default GenresTable;
