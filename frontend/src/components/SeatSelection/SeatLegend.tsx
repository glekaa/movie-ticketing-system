const SeatLegend = () => {
    return (
        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 mt-6 bg-[#1a1919] border border-white/5 py-3 px-6 rounded-full max-w-md mx-auto">
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-white/5 border border-white/10" />
                <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-gradient-to-b from-[#00A3FF] to-[#0055FF] shadow-[0_0_8px_rgba(0,163,255,0.6)]" />
                <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-t-md rounded-b-sm bg-white/5 border border-white/5 opacity-30" />
                <span>Occupied</span>
            </div>
        </div>
    );
};

export default SeatLegend;
