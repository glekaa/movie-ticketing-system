import SeatButton from "./SeatButton";

interface SeatMapProps {
    totalRows: number;
    seatsPerRow: number;
    selectedSeats: string[];
    occupiedSeats: Set<string>;
    onSeatClick: (seatId: string) => void;
}

const SeatMap = ({ totalRows, seatsPerRow, selectedSeats, occupiedSeats, onSeatClick }: SeatMapProps) => {
    return (
        <div className="flex flex-col items-center select-none w-full">
            {/* Screen Banner */}
            <div className="relative w-full max-w-xl mb-12 flex flex-col items-center">
                <div className="w-full h-2 rounded-full bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent shadow-[0_0_15px_rgba(0,163,255,0.8)] opacity-80" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mt-2.5">Screen</span>
            </div>

            {/* Seat Grid Scroll Container */}
            <div className="w-full overflow-x-auto scrollbar-thin flex justify-start sm:justify-center px-4 pb-4">
                <div className="space-y-2 md:space-y-3 min-w-max">
                    {[...Array(totalRows)].map((_, r) => {
                        const rowLabel = String.fromCharCode(65 + r); // A, B, C...
                        return (
                            <div key={rowLabel} className="flex items-center gap-2 sm:gap-3 md:gap-4 justify-center">
                                {/* Row Label (Left) */}
                                <span className="text-[10px] sm:text-xs font-bold text-gray-600 w-3 sm:w-4 text-center">{rowLabel}</span>

                                {/* Seats */}
                                <div className="flex gap-1 sm:gap-1.5 md:gap-2">
                                    {[...Array(seatsPerRow)].map((_, c) => {
                                        const colNumber = c + 1;
                                        const seatId = `${rowLabel}${colNumber}`;

                                        const isSelected = selectedSeats.includes(seatId);
                                        const isOccupied = occupiedSeats.has(seatId);
                                        const status = isOccupied ? "occupied" : isSelected ? "selected" : "available";

                                        return (
                                            <SeatButton
                                                key={seatId}
                                                rowLabel={rowLabel}
                                                colNumber={colNumber}
                                                status={status}
                                                onClick={() => onSeatClick(seatId)}
                                            />
                                        );
                                    })}
                                </div>

                                {/* Row Label (Right) */}
                                <span className="text-[10px] sm:text-xs font-bold text-gray-600 w-3 sm:w-4 text-center">{rowLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SeatMap;
