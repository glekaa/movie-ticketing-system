interface TicketListProps {
    ticketCount: number;
    selectedSeats: string[];
}

const TicketList = ({ ticketCount, selectedSeats }: TicketListProps) => {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 font-['Montserrat']">Your Tickets</h3>
            {[...Array(ticketCount)].map((_, index) => {
                const seatSelected = selectedSeats[index];
                return (
                    <div
                        key={index}
                        className={`p-3.5 rounded-xl border transition-all duration-300 ${
                            seatSelected
                                ? "bg-[#00A3FF]/5 border-[#00A3FF]/20 shadow-[0_4px_20px_rgba(0,163,255,0.05)]"
                                : "bg-[#121111] border-white/5"
                        }`}
                    >
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-400 font-semibold">Ticket {index + 1}</span>
                            <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    seatSelected
                                        ? "bg-[#00A3FF]/10 text-[#00A3FF]"
                                        : "bg-white/5 text-gray-500"
                                }`}
                            >
                                {seatSelected ? "Seat Assigned" : "Pending"}
                            </span>
                        </div>
                        <p
                            className={`text-sm font-bold mt-1 font-['Montserrat'] ${
                                seatSelected ? "text-white" : "text-gray-600 italic"
                            }`}
                        >
                            {seatSelected ? `Seat: ${seatSelected}` : "Please select a seat on the map"}
                        </p>
                    </div>
                );
            })}
        </div>
    );
};

export default TicketList;
