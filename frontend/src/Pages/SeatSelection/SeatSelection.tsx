import { useState, useEffect, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router";
import { useBasket } from "../../context/BasketContext";
import movieServices from "../../services/movieServices";
import showtimeServices from "../../services/showtimeServices";
import theaterServices from "../../services/theaterServices";
import SeatMap from "../../components/SeatSelection/SeatMap";
import SeatLegend from "../../components/SeatSelection/SeatLegend";
import TicketList from "../../components/SeatSelection/TicketList";
import Button from "../../components/Elements/Button";
import { ArrowLeft, Calendar, Clock, MapPin, Info } from "lucide-react";
import { formatDuration } from "../../utils";
import type { Movie, Showtime, Theater, Screen } from "../../types";

const SeatSelection = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addToBasket } = useBasket();

    const showtimeId = searchParams.get("showtime_id");
    const ticketCount = parseInt(searchParams.get("ticket_count") || "1", 10);

    // Data States
    const [movie, setMovie] = useState<Movie | null>(null);
    const [showtime, setShowtime] = useState<Showtime | null>(null);
    const [theater, setTheater] = useState<Theater | null>(null);
    const [screen, setScreen] = useState<Screen | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch all data
    useEffect(() => {
        const fetchData = async () => {
            if (!id || !showtimeId) {
                setError("Missing required parameters.");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // Fetch Movie
                const movieData = await movieServices.getMovieById(id);
                setMovie(movieData);

                // Fetch Showtimes & Find matching showtime
                const showtimes = await showtimeServices.getMovieShowtimes(id);
                const matchedShowtime = showtimes.find((s) => s.id === showtimeId);

                if (!matchedShowtime) {
                    throw new Error("Showtime not found.");
                }
                setShowtime(matchedShowtime);

                // Fetch Theaters & Find matching theater/screen
                const theaters = await theaterServices.getAllTheaters();
                let matchedTheater: Theater | null = null;
                let matchedScreen: Screen | null = null;

                for (const t of theaters) {
                    const scr = t.screens.find((s) => s.id === matchedShowtime.screen_id);
                    if (scr) {
                        matchedTheater = t;
                        matchedScreen = scr;
                        break;
                    }
                }

                if (!matchedTheater || !matchedScreen) {
                    throw new Error("Theater or screen layout not found.");
                }

                setTheater(matchedTheater);
                setScreen(matchedScreen);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to load seating configuration.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, showtimeId]);

    // 2. Generate Occupied Seats deterministically
    const occupiedSeats = useMemo(() => {
        if (!showtimeId || !screen) return new Set<string>();
        const totalRows = screen.total_rows || 8;
        const seatsPerRow = screen.seats_per_row || 10;

        const occupied = new Set<string>();
        let hash = 0;
        for (let i = 0; i < showtimeId.length; i++) {
            hash = (hash << 5) - hash + showtimeId.charCodeAt(i);
            hash |= 0;
        }

        const random = (seed: number) => {
            const x = Math.sin(seed++) * 10000;
            return x - Math.floor(x);
        };

        let seed = Math.abs(hash);
        for (let r = 0; r < totalRows; r++) {
            const rowLabel = String.fromCharCode(65 + r);
            for (let c = 1; c <= seatsPerRow; c++) {
                if (random(seed++) < 0.35) { // 35% occupied
                    occupied.add(`${rowLabel}${c}`);
                }
            }
        }
        return occupied;
    }, [showtimeId, screen]);

    // 3. Handle Seat Clicks
    const handleSeatClick = (seatId: string) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }
            if (prev.length < ticketCount) {
                return [...prev, seatId];
            }
            // FIFO sliding window (replace the oldest selected seat)
            return [...prev.slice(1), seatId];
        });
    };

    // 4. Handle Add to Basket
    const handleAddToBasket = () => {
        if (!movie || !showtime || !theater || !screen || selectedSeats.length !== ticketCount) {
            return;
        }

        const date = new Date(showtime.start_time);
        const dateStr = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        const timeStr = date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        addToBasket({
            movieId: movie.id,
            movieTitle: movie.title,
            moviePosterUrl: movie.poster_url,
            movieDurationMinutes: movie.duration_minutes,
            showtimeId: showtime.id,
            showtimeTime: timeStr,
            showtimeDate: dateStr,
            theaterName: theater.name,
            quantity: ticketCount,
            ticketPrice: parseFloat(showtime.base_price),
            seats: selectedSeats,
        });

        // Navigate to the basket
        navigate("/basket");
    };

    // Helper formatters
    const formatShowtimeDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const formatShowtimeTime = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        } catch {
            return dateStr;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#0d0c0c] text-white">
                <div className="text-center space-y-4 animate-pulse">
                    <svg className="animate-spin h-10 w-10 text-[#00A3FF] mx-auto" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-sm font-semibold tracking-wider text-gray-400">Loading Cinema Layout...</p>
                </div>
            </div>
        );
    }

    if (error || !movie || !showtime || !theater || !screen) {
        return (
            <main className="max-w-md mx-auto px-4 py-20 text-center text-white bg-[#0d0c0c] h-screen flex flex-col justify-center items-center">
                <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-2xl p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#FF3B30] font-['Montserrat']">Error Loading Page</h2>
                    <p className="text-sm text-gray-400">{error || "Seat selection is unavailable for this showtime."}</p>
                    <Button onClick={() => navigate(-1)} variant="secondary" className="w-full mt-4">
                        Go Back
                    </Button>
                </div>
            </main>
        );
    }

    const pricePerTicket = parseFloat(showtime.base_price);
    const subtotal = ticketCount * pricePerTicket;

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in text-white min-h-[calc(100vh-80px)]">
            {/* Header / Back navigation */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold font-['Montserrat'] tracking-wide">Select Seats</h1>
                    <p className="text-xs text-gray-400">Choose {ticketCount} {ticketCount === 1 ? "seat" : "seats"} for your viewing</p>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left Area: Screen and Seat Map */}
                <section className="lg:col-span-2 bg-[#1a1919] border border-white/5 rounded-2xl p-6 md:p-10 shadow-lg flex flex-col justify-center">
                    <SeatMap
                        totalRows={screen.total_rows || 8}
                        seatsPerRow={screen.seats_per_row || 10}
                        selectedSeats={selectedSeats}
                        occupiedSeats={occupiedSeats}
                        onSeatClick={handleSeatClick}
                    />
                    <SeatLegend />
                </section>

                {/* Right Area: Ticket Assignment and Details */}
                <aside className="space-y-6">
                    {/* Movie Info Card */}
                    <div className="bg-[#1a1919] border border-white/5 rounded-2xl p-5 shadow-lg flex gap-4">
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="w-20 aspect-[3/4] object-cover rounded-lg ring-1 ring-white/10 shrink-0"
                        />
                        <div className="space-y-1.5 min-w-0">
                            <h2 className="text-lg font-bold truncate font-['Montserrat']">{movie.title}</h2>
                            <p className="text-xs text-gray-400">Duration: {formatDuration(movie.duration_minutes)}</p>

                            <div className="space-y-1 text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                    <span className="truncate">{theater.name} — {screen.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                    <span>{formatShowtimeDate(showtime.start_time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                    <span>{formatShowtimeTime(showtime.start_time)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ticket seat checklist */}
                    <div className="bg-[#1a1919] border border-white/5 rounded-2xl p-5 shadow-lg">
                        <TicketList
                            ticketCount={ticketCount}
                            selectedSeats={selectedSeats}
                        />

                        {/* Totals Summary */}
                        <div className="border-t border-white/5 pt-4 mt-6 space-y-2 text-xs text-gray-400">
                            <div className="flex justify-between">
                                <span>Ticket Price ({ticketCount} × ${pricePerTicket.toFixed(2)})</span>
                                <span className="text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/5">
                                <span>Total Price</span>
                                <span className="text-[#00A3FF] font-['Montserrat']">${subtotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Complete Seating CTA */}
                        <Button
                            onClick={handleAddToBasket}
                            className="w-full py-3.5 mt-6 text-sm flex items-center justify-center gap-2"
                            variant="primary"
                            disabled={selectedSeats.length !== ticketCount}
                        >
                            Confirm & Add to Basket
                        </Button>

                        {/* Guide message */}
                        {selectedSeats.length < ticketCount && (
                            <div className="flex items-start gap-2.5 text-[10px] text-gray-400 mt-4 bg-white/5 p-3 rounded-xl border border-white/5">
                                <Info className="w-4 h-4 text-[#00A3FF] shrink-0 mt-0.5" />
                                <span>
                                    Please select exactly <strong>{ticketCount - selectedSeats.length}</strong> more {ticketCount - selectedSeats.length === 1 ? "seat" : "seats"} on the map to proceed.
                                </span>
                            </div>
                        )}
                    </div>
                </aside>

            </div>
        </main>
    );
};

export default SeatSelection;