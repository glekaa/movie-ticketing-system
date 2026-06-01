import { useState, useMemo, useEffect } from "react";
import Button from "../Elements/Button";
import LoadingState from "../LayoutElements/LoadingState";
import ErrorState from "../LayoutElements/ErrorState";
import { MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import movieServices from "../../services/movieServices";
import theaterServices from "../../services/theaterServices";
import type { Showtime, Theater } from "../../types";

interface ShowtimesProps {
    movieId: string;
}

const Showtimes = ({ movieId }: ShowtimesProps) => {
    const { data: showtimes, isLoading: isLoadingShowtimes, isError: isErrorShowtimes } = useQuery<Showtime[]>({
        queryKey: ["showtimes", movieId],
        queryFn: () => movieServices.getMovieShowtimes(movieId),
        enabled: !!movieId,
    });

    const { data: theaters, isLoading: isLoadingTheaters } = useQuery<Theater[]>({
        queryKey: ["theaters"],
        queryFn: () => theaterServices.getAllTheaters(),
    });

    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);
    const [ticketCount, setTicketCount] = useState<number>(1);

    const navigate = useNavigate();

    // Grouping
    const { dateTabs, showtimesByDateAndTheater } = useMemo(() => {
        if (!showtimes || !theaters) return { dateTabs: [], showtimesByDateAndTheater: {} };

        // Create a map of screenId -> Theater
        const screenToTheater: Record<string, Theater> = {};
        for (const theater of theaters) {
            for (const screen of theater.screens) {
                screenToTheater[screen.id] = theater;
            }
        }

        const dateMap: Record<string, Record<string, Showtime[]>> = {};

        for (const showtime of showtimes) {
            const dateObj = new Date(showtime.start_time);

            // Format to local date string YYYY-MM-DD
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const theater = screenToTheater[showtime.screen_id];
            if (!theater) continue; // Skip if theater is unknown

            if (!dateMap[dateStr]) dateMap[dateStr] = {};
            if (!dateMap[dateStr][theater.name]) dateMap[dateStr][theater.name] = [];

            dateMap[dateStr][theater.name].push(showtime);
        }

        const sortedDates = Object.keys(dateMap).sort();

        // Format for tabs
        const dateTabs = sortedDates.map(dateStr => {
            const [y, m, d] = dateStr.split('-');
            const dt = new Date(Number(y), Number(m) - 1, Number(d));
            return {
                value: dateStr,
                dayName: dt.toLocaleDateString("en-US", { weekday: 'short' }), // "Mon"
                dateText: dt.toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) // "Oct 24"
            }
        });

        return { dateTabs, showtimesByDateAndTheater: dateMap };

    }, [showtimes, theaters]);

    useEffect(() => {
        if (dateTabs.length > 0 && !selectedDate) {
            setSelectedDate(dateTabs[0].value);
        }
    }, [dateTabs, selectedDate]);

    if (isLoadingShowtimes || isLoadingTheaters) {
        return (
            <div className="bg-[#141313] rounded-2xl p-6 border border-white/5 sticky top-24 flex items-center justify-center h-64">
                <LoadingState />
            </div>
        );
    }

    if (isErrorShowtimes) {
        return (
            <div className="bg-[#141313] rounded-2xl p-6 border border-white/5 sticky top-24 flex items-center justify-center h-64">
                <ErrorState message="Error loading showtimes" />
            </div>
        );
    }

    const currentTheatersMap = selectedDate ? showtimesByDateAndTheater[selectedDate] : {};

    return (
        <section className="bg-[#141313] rounded-2xl p-6 border border-white/5 lg:sticky lg:top-24">
            <h2 className="text-xl font-bold mb-6 text-[#E5E2E1]">Select Showtime</h2>

            {/* Dates */}
            <div className="mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <p className="text-[10px] text-[#8B8D8D] font-bold tracking-widest uppercase mb-3">Date</p>
                <div className="flex flex-row gap-3">
                    {dateTabs.length === 0 ? (
                        <span className="text-gray-500 text-sm">No showtimes available</span>
                    ) : dateTabs.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => {
                                setSelectedDate(tab.value);
                                setSelectedShowtime(null);
                                setTicketCount(1);
                            }}
                            className={`flex flex-col items-center justify-center px-4 py-2 rounded-full min-w-[80px] transition-all cursor-pointer ${selectedDate === tab.value
                                ? "bg-[#00A3FF] text-white shadow-[0_4px_15px_-4px_rgba(0,163,255,0.5)]"
                                : "bg-white/5 border border-white/10 text-[#C4C7C7] hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            <span className="font-semibold text-sm">{tab.dayName}</span>
                            <span className="text-[10px] opacity-80">{tab.dateText}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Locations & Times */}
            <div className="flex flex-col gap-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {currentTheatersMap && Object.keys(currentTheatersMap).length > 0 ? (
                    Object.entries(currentTheatersMap).map(([theaterName, theaterShowtimes]) => (
                        <div key={theaterName}>
                            <div className="flex items-center gap-2 mb-3">
                                <MapPin className="w-4 h-4 text-[#8B8D8D]" />
                                <h3 className="font-semibold text-sm text-[#E5E2E1]">{theaterName}</h3>
                            </div>
                            <div className="flex flex-row flex-wrap gap-2">
                                {theaterShowtimes.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map(st => {
                                    const timeStr = new Date(st.start_time).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false });
                                    const isAvailable = st.status === "scheduled";
                                    const isSelected = selectedShowtime?.id === st.id;
                                    return (
                                        <button
                                            key={st.id}
                                            disabled={!isAvailable}
                                            onClick={() => {
                                                setSelectedShowtime(st);
                                                setTicketCount(1);
                                            }}
                                            className={`px-4 py-1.5 rounded-full text-xs transition-colors cursor-pointer ${isAvailable
                                                ? isSelected
                                                    ? "bg-[#00A3FF] border border-[#00A3FF] text-white shadow-[0_4px_15px_-4px_rgba(0,163,255,0.5)]"
                                                    : "bg-[#0a0807] border border-white/10 text-[#C4C7C7] hover:border-white/30 hover:text-white"
                                                : "bg-[#0a0807] border border-white/5 text-[#8B8D8D] opacity-50 cursor-not-allowed line-through"
                                                }`}
                                        >
                                            {timeStr}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                ) : (
                    dateTabs.length > 0 && <span className="text-gray-500 text-sm">No showtimes for this date.</span>
                )}
            </div>

            {/* Ticket Counter */}
            {selectedShowtime && (
                <section className="mb-6 bg-white/5 border border-white/5 rounded-xl p-4 animate-fade-in space-y-3">
                    <p className="text-[10px] text-[#8B8D8D] font-bold tracking-widest uppercase">Tickets</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                -
                            </button>
                            <span className="text-white font-semibold text-base w-6 text-center">{ticketCount}</span>
                            <button
                                type="button"
                                onClick={() => setTicketCount(prev => prev + 1)}
                                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer"
                            >
                                +
                            </button>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 block">Total Price</span>
                            <span className="text-base font-bold text-white font-['Montserrat']">
                                ${(ticketCount * Number(selectedShowtime.base_price)).toFixed(2)}
                            </span>
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <Button
                onClick={() => navigate(`/movie/${movieId}/seats?showtime_id=${selectedShowtime?.id}&ticket_count=${ticketCount}`)}
                className={`w-full py-3 text-sm ${!selectedShowtime ? "bg-black/5 border-white/5 text-[#8B8D8D] opacity-50 cursor-not-allowed" : ""}`}
                variant="primary"
                disabled={!selectedShowtime}
            >
                Continue to seat selection
            </Button>
        </section>
    );
};

export default Showtimes;
