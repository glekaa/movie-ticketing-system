import { useState, useEffect } from "react";
import { formatDuration } from "../../utils";
import { Trash2, MapPin, Calendar, Clock, Hourglass } from "lucide-react";
import type { BasketItem } from "../../types";

interface BasketItemProps {
    item: BasketItem;
    handleRemoveItem: (id: string) => void;
    handleQuantityChange: (id: string, newQuantity: number) => void;
}

const BasketItemCard = ({ item, handleRemoveItem, handleQuantityChange }: BasketItemProps) => {
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
        <article className="bg-[#1a1919] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col sm:flex-row gap-5">
            <img
                src={item.moviePosterUrl}
                alt={item.movieTitle}
                className="w-full sm:w-24 aspect-[3/4] sm:h-32 object-cover rounded-xl ring-1 ring-white/10 shrink-0 shadow-md"
            />

            <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide font-['Montserrat']">{item.movieTitle}</h2>
                            {item.expiresAt && secondsLeft > 0 && (
                                <div className="flex items-center gap-1.5 text-xs mt-1">
                                    <Hourglass className={`w-3.5 h-3.5 ${secondsLeft < 60 ? "text-[#FF3B30] animate-pulse" : "text-amber-500"}`} />
                                    <span className={secondsLeft < 60 ? "text-[#FF3B30] font-semibold" : "text-amber-500 font-medium"}>
                                        Expires in: {formatTimeLeft(secondsLeft)}
                                    </span>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-500 hover:text-[#FF3B30] transition-colors p-1 cursor-pointer"
                            title="Remove reservation"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                    <p className="text-xs text-gray-400">
                        Duration: {formatDuration(item.movieDurationMinutes)}
                    </p>
                    {item.seats && item.seats.length > 0 && (
                        <p className="text-xs text-[#00A3FF] font-semibold mt-1 font-['Montserrat']">
                            Seats: {item.seats.join(", ")}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-3 text-xs text-gray-300">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{item.theaterName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>{item.showtimeDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span>{item.showtimeTime}</span>
                    </div>
                </div>

                <div className="flex flex-row justify-between items-center border-t border-white/5 pt-3 mt-1">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
                        >
                            -
                        </button>
                        <span className="text-white font-semibold text-sm w-5 text-center">{item.quantity}</span>
                        <button
                            type="button"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors cursor-pointer text-sm"
                        >
                            +
                        </button>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] text-gray-500 block">Total</span>
                        <span className="text-base font-bold text-white">${item.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default BasketItemCard;
