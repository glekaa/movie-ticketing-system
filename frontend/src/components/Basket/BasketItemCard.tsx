import { useState, useEffect } from "react";
import { Link } from "react-router";
import { formatDuration } from "../../utils";
import { Trash2, MapPin, Calendar, Clock, Hourglass } from "lucide-react";
import type { BasketItem } from "../../types";

interface BasketItemProps {
    item: BasketItem;
    handleRemoveItem: (id: string) => void;
}

const BasketItemCard = ({ item, handleRemoveItem }: BasketItemProps) => {
    const [secondsLeft, setSecondsLeft] = useState(() => {
        if (!item.expiresAt) return 0;
        return Math.max(0, Math.floor((item.expiresAt - Date.now()) / 1000));
    });

    useEffect(() => {
        if (!item.expiresAt) return;

        setSecondsLeft(Math.max(0, Math.floor((item.expiresAt - Date.now()) / 1000)));

        const timer = setInterval(() => {
            setSecondsLeft(() => {
                const left = Math.max(0, Math.floor((item.expiresAt! - Date.now()) / 1000));
                if (left <= 0) {
                    clearInterval(timer);
                }
                return left;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [item.expiresAt]);

    const formatTimeLeft = (sec: number) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <article className="bg-[#1a1919] border border-white/5 hover:border-white/10 rounded-2xl transition-all duration-300 flex flex-row overflow-hidden">
            <img
                src={item.moviePosterUrl}
                alt={item.movieTitle}
                className="w-24 sm:w-32 object-cover shrink-0"
            />

            <div className="flex-1 flex flex-col justify-between min-w-0 p-4 sm:p-5 md:p-6">
                <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                            <h2 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-wide font-['Montserrat'] truncate">{item.movieTitle}</h2>
                            {item.expiresAt && secondsLeft > 0 && (
                                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs mt-1">
                                    <Hourglass className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${secondsLeft < 60 ? "text-[#FF3B30] animate-pulse" : "text-amber-500"}`} />
                                    <span className={secondsLeft < 60 ? "text-[#FF3B30] font-semibold" : "text-amber-500 font-medium"}>
                                        Expires in: {formatTimeLeft(secondsLeft)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-500 hover:text-[#FF3B30] transition-colors p-1 cursor-pointer shrink-0"
                            title="Remove reservation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                        Duration: {formatDuration(item.movieDurationMinutes)}
                    </p>
                    {item.seats && item.seats.length > 0 && (
                        <p className="text-[10px] sm:text-xs text-[#00A3FF] font-semibold mt-1 font-['Montserrat'] truncate">
                            Seats: {item.seats.join(", ")}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-3 my-2 text-[10px] sm:text-xs text-gray-300">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{item.theaterName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{item.showtimeDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0">
                        <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{item.showtimeTime}</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-white/5 pt-3 mt-1.5 gap-2 sm:gap-4">
                    <div className="flex flex-wrap items-center gap-2.5 text-[10px] sm:text-xs">
                        <span className="text-gray-400">
                            Tickets: <strong className="text-white font-semibold">{item.quantity}</strong>
                        </span>
                        <span className="text-white/10">|</span>
                        <Link
                            to={`/movie/${item.movieId}`}
                            className="font-semibold text-[#00A3FF] hover:text-[#33b5ff] transition-colors cursor-pointer"
                        >
                            Add tickets
                        </Link>
                        <span className="text-white/10">|</span>
                        <Link
                            to="/movies"
                            className="font-semibold text-gray-400 hover:text-white transition-colors"
                        >
                            Browse movies
                        </Link>
                    </div>
                    <div className="text-right w-full sm:w-auto flex sm:flex-col justify-between sm:justify-end items-center sm:items-end mt-1 sm:mt-0">
                        <span className="text-[10px] text-gray-500 block sm:hidden">Total</span>
                        <span className="text-[10px] text-gray-500 hidden sm:block">Total</span>
                        <span className="text-sm sm:text-base font-bold text-white font-['Montserrat']">${item.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BasketItemCard;
