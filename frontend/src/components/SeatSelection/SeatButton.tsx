interface SeatButtonProps {
    rowLabel: string;
    colNumber: number;
    status: "available" | "selected" | "occupied";
    onClick: () => void;
}

const SeatButton = ({ rowLabel, colNumber, status, onClick }: SeatButtonProps) => {
    const seatId = `${rowLabel}${colNumber}`;

    const baseStyles =
        "text-xs font-semibold rounded-t-xl rounded-b-sm w-8 h-8 md:w-10 md:h-10 transition-all duration-200 flex items-center justify-center font-['Montserrat']";

    const statusStyles = {
        available:
            "bg-white/5 border border-white/10 hover:bg-white/20 text-gray-400 hover:text-white cursor-pointer hover:scale-105 active:scale-95",
        selected:
            "bg-gradient-to-b from-[#00A3FF] to-[#0055FF] text-white border border-[#00A3FF]/50 shadow-[0_0_12px_rgba(0,163,255,0.6)] cursor-pointer hover:scale-105 active:scale-95",
        occupied:
            "bg-white/5 border border-white/5 text-gray-700 cursor-not-allowed opacity-30",
    };

    return (
        <button
            type="button"
            className={`${baseStyles} ${statusStyles[status]}`}
            onClick={status !== "occupied" ? onClick : undefined}
            disabled={status === "occupied"}
            title={status === "occupied" ? `Seat ${seatId} - Booked` : `Seat ${seatId}`}
            aria-label={`Seat ${seatId}`}
        >
            {colNumber}
        </button>
    );
};

export default SeatButton;
