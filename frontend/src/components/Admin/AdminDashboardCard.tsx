import Button from "../Elements/Button";
import { ArrowRight } from "lucide-react";

export interface DashboardStat {
    label: string;
    value: string | number;
}

interface AdminDashboardCardProps {
    title: string;
    stats: DashboardStat[];
    buttonText: string;
    onButtonClick?: () => void;
}

const AdminDashboardCard = ({ title, stats, buttonText, onButtonClick }: AdminDashboardCardProps) => {
    return (
        <article className="flex flex-col gap-5 w-full text-left bg-gradient-to-br from-[#1E1E1E] to-[#121212] p-6 rounded-2xl border border-white/5 hover:border-[#00A3FF]/40 transition-all duration-300 shadow-xl hover:shadow-[#00A3FF]/10 group">
            
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
                {title}
            </h3>
            
            <div className="flex flex-col gap-3 flex-1">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="flex flex-row justify-between items-center py-2 border-b border-white/5 last:border-b-0"
                    >
                        <h4 className="text-sm md:text-base font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                            {stat.label}
                        </h4>
                        <span className="text-base md:text-lg font-bold text-white tracking-wide">
                            {stat.value}
                        </span>
                    </div>
                ))}
            </div>

            <Button 
                variant="primary" 
                onClick={onButtonClick}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-[#00A3FF]/10 text-[#00A3FF] hover:bg-[#00A3FF] hover:text-white border-none group-hover:shadow-[0_0_15px_rgba(0,163,255,0.3)] transition-all duration-300"
            >
                {buttonText} 
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            
        </article>
    );
};

export default AdminDashboardCard;
