import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";
import AdminDashboardCard from "../../components/Admin/AdminDashboardCard";

const DASHBOARD_CARDS = [
    {
        title: "Movies Management",
        stats: [
            { label: "Total movies", value: "25" },
            { label: "Now showing", value: "20" },
            { label: "Coming soon", value: "5" },
        ],
        buttonText: "Go to Movies Table"
    },
    {
        title: "Theaters Management",
        stats: [
            { label: "Open Locations", value: "3 Cities" },
            { label: "Total Screens", value: "10" },
            { label: "Total Seating Capacity", value: "1,000" },
        ],
        buttonText: "Go to Theaters Table"
    },
    {
        title: "Sales & Analytics",
        stats: [
            { label: "Today's Revenue", value: "$1,000" },
            { label: "Bookings Count", value: "10" },
            { label: "Best Selling Movie", value: "The Matrix" },
            { label: "Best Selling Theater", value: "Regal Cinema" },
        ],
        buttonText: "Go to Sales & Analytics Table"
    },
    {
        title: "Showtimes Management",
        stats: [
            { label: "Showtimes today", value: "50" },
            { label: "Active Screens now", value: "4/10" },
            { label: "Next session", value: "The Matrix @ 20:55" },
        ],
        buttonText: "Go to Showtimes Table"
    }
];

const AdminDashboard = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#121111] font-sans">
            <Header />
            <main className="flex-1 px-4 md:px-8 py-8 text-white max-w-7xl mx-auto w-full animate-fade-in">
                
                <header className="mb-10">
                    <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                        Welcome, Admin
                    </h2>
                    <p className="text-gray-400 mt-2">Here's an overview of your ticketing system today.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8">
                    {DASHBOARD_CARDS.map((card) => (
                        <AdminDashboardCard 
                            key={card.title}
                            title={card.title}
                            stats={card.stats}
                            buttonText={card.buttonText}
                            onButtonClick={() => { /* Navigation hook can go here */ }}
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default AdminDashboard;