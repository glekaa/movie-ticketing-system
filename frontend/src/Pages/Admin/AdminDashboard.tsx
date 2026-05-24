import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import AdminDashboardCard from "../../components/Admin/AdminDashboardCard";
import LoadingState from "../../components/LayoutElements/LoadingState";
import ErrorState from "../../components/LayoutElements/ErrorState";
import movieServices from "../../services/movieServices"
import theaterServices from "../../services/theaterServices";
import type { Movie, Theater } from "../../types";

const DASHBOARD_CARDS = [
    {
        title: "Movies Management",
        stats: [
            { label: "Total movies", value: 0 },
            { label: "Now showing", value: 0 },
            { label: "Coming soon", value: 0 },
        ],
        buttonText: "Go to Movies Table"
    },
    {
        title: "Theaters Management",
        stats: [
            { label: "Open Locations", value: 0 },
            { label: "Total Screens", value: 0 },
            { label: "Total Seating Capacity", value: 0 },
        ],
        buttonText: "Go to Theaters Table"
    },
    {
        title: "Sales & Analytics",
        stats: [
            { label: "Today's Revenue", value: 0 },
            { label: "Bookings Count", value: 0 },
            { label: "Best Selling Movie", value: "N/A" },
            { label: "Best Selling Theater", value: "N/A" },
        ],
        buttonText: "Go to Sales & Analytics Table"
    },
    {
        title: "Showtimes Management",
        stats: [
            { label: "Showtimes today", value: 0 },
            { label: "Active Screens now", value: 0 },
            { label: "Next session", value: "N/A" },
        ],
        buttonText: "Go to Showtimes Table"
    }
];

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [dashboardCards, setDashboardCards] = useState(DASHBOARD_CARDS);

    const { data: movies } = useQuery<Movie[]>({
        queryKey: ["movies"],
        queryFn: () => movieServices.getAllMovies()
    });

    const { data: theaters } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters()
    });

    useEffect(() => {
        if (movies) {
            const totalMovies = movies.length;
            const nowShowingMovies = movies.filter(movie => movie.status === "now_showing").length;
            const comingSoonMovies = movies.filter(movie => movie.status === "coming_soon").length;

            setDashboardCards(prev => prev.map(card => {
                if (card.title === "Movies Management") {
                    return {
                        ...card,
                        stats: [
                            { label: "Total movies", value: totalMovies },
                            { label: "Now showing", value: nowShowingMovies },
                            { label: "Coming soon", value: comingSoonMovies },
                        ],
                    };
                }
                return card;
            }));
        }
    }, [movies])

    useEffect(() => {
        if (theaters) {
            const openLocations = theaters.length;
            const totalScreens = theaters.reduce((acc, theater) => acc + theater.screens.length, 0);
            const totalSeatingCapacity = theaters.reduce((acc, theater) => acc + theater.screens.reduce((acc, screen) => acc + screen.capacity, 0), 0);

            setDashboardCards(prev => prev.map(card => {
                if (card.title === "Theaters Management") {
                    return {
                        ...card,
                        stats: [
                            { label: "Open Locations", value: openLocations },
                            { label: "Total Screens", value: totalScreens },
                            { label: "Total Seating Capacity", value: totalSeatingCapacity },
                        ],
                    };
                }
                return card;
            }));
        }
    }, [theaters])

    return (
        <main className="flex-1 px-4 md:px-8 py-8 text-white max-w-7xl mx-auto w-full animate-fade-in">
            <header className="mb-10">
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                    Welcome, Admin
                </h2>
                <p className="text-gray-400 mt-2">Here's an overview of your ticketing system today.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                {dashboardCards.map((card) => (
                    <AdminDashboardCard
                        key={card.title}
                        title={card.title}
                        stats={card.stats}
                        buttonText={card.buttonText}
                        onButtonClick={() => { navigate('/admin/' + card.title.toLowerCase().replace(/ /g, '-')) }}
                    />
                ))}
            </div>
        </main>
    )
}

export default AdminDashboard;