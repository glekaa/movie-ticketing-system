import { useNavigate } from "react-router";

interface AdminTabsProps {
    activeTab: "movies" | "theaters" | "genres";
}

export const AdminTabs = ({ activeTab }: AdminTabsProps) => {
    const navigate = useNavigate();

    return (
        <div className="flex gap-6 border-b border-gray-800/50 mt-6 mb-2">
            <button
                onClick={() => navigate("/admin/movies-management")}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                    activeTab === "movies"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
            >
                Movies
            </button>
            <button
                onClick={() => navigate("/admin/theaters-management")}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                    activeTab === "theaters"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
            >
                Theaters
            </button>
            <button
                onClick={() => navigate("/admin/genres")}
                className={`pb-3 text-sm font-semibold uppercase tracking-wider border-b-2 cursor-pointer transition-all ${
                    activeTab === "genres"
                        ? "border-blue-500 text-blue-400"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
            >
                Genres
            </button>
        </div>
    );
};

export default AdminTabs;
