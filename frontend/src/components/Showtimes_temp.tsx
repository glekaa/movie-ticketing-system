import Button from "./Button";
import { MapPin } from "lucide-react";

const Showtimes = () => {
    return (
        <div className="bg-[#141313] rounded-2xl p-6 border border-white/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-[#E5E2E1]">Select Showtime</h2>
            
            {/* Dates */}
            <div className="mb-8">
                <p className="text-[10px] text-[#8B8D8D] font-bold tracking-widest uppercase mb-3">Date</p>
                <div className="flex flex-row gap-3">
                    <button className="flex flex-col items-center justify-center px-4 py-2 rounded-full bg-[#00A3FF] text-white min-w-[70px] shadow-[0_4px_15px_-4px_rgba(0,163,255,0.5)]">
                        <span className="font-semibold text-sm">Today</span>
                        <span className="text-[10px] opacity-80">Oct 24</span>
                    </button>
                    <button className="flex flex-col items-center justify-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#C4C7C7] hover:bg-white/10 hover:text-white transition-all min-w-[70px]">
                        <span className="font-semibold text-sm">Tomorrow</span>
                        <span className="text-[10px] opacity-60">Oct 25</span>
                    </button>
                    <button className="flex flex-col items-center justify-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#C4C7C7] hover:bg-white/10 hover:text-white transition-all min-w-[70px]">
                        <span className="font-semibold text-sm">Sat</span>
                        <span className="text-[10px] opacity-60">Oct 26</span>
                    </button>
                </div>
            </div>

            {/* Locations & Times */}
            <div className="flex flex-col gap-6 mb-8">
                {/* Location 1 */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[#8B8D8D]" />
                        <h3 className="font-semibold text-sm text-[#E5E2E1]">absolute Downtown IMAX</h3>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">14:30</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">17:15</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">20:00</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">22:45</button>
                    </div>
                </div>

                {/* Location 2 */}
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-[#8B8D8D]" />
                        <h3 className="font-semibold text-sm text-[#E5E2E1]">absolute Westside VIP</h3>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">16:00</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/10 text-xs text-[#C4C7C7] hover:border-white/30 hover:text-white transition-colors">19:30</button>
                        <button className="px-4 py-1.5 rounded-full bg-[#0a0807] border border-white/5 text-xs text-[#8B8D8D] opacity-50 cursor-not-allowed line-through">21:00</button>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <Button className="w-full py-3 text-sm" variant="primary">Continue to Seat Selection</Button>
        </div>
    );
};

export default Showtimes;
