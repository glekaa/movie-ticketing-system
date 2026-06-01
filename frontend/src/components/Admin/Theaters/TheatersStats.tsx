import { Building2, Film, Users } from "lucide-react";

interface TheatersStatsProps {
    totalTheaters: number;
    totalScreens: number;
    totalCapacity: number;
}

export const TheatersStats = ({ totalTheaters, totalScreens, totalCapacity }: TheatersStatsProps) => {
    return (
        <section className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Statistics</h3>
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
                        <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block">Total Locations</span>
                        <span className="text-sm font-bold text-white">{totalTheaters}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg">
                        <Film className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block">Total Screens</span>
                        <span className="text-sm font-bold text-white">{totalScreens}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                        <Users className="w-4 h-4" />
                    </div>
                    <div>
                        <span className="text-xs text-gray-400 block">Seating Capacity</span>
                        <span className="text-sm font-bold text-white">{totalCapacity}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TheatersStats;
