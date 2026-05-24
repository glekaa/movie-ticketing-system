import { formatDuration } from "../../utils";
import { Trash2, MapPin, Calendar, Clock } from "lucide-react";
import type { BasketItem } from "../../types";

interface BasketItemProps {
    item: BasketItem;
    handleRemoveItem: (id: string) => void;
    handleQuantityChange: (id: string, newQuantity: number) => void;
}

const BasketItemCard = ({ item, handleRemoveItem, handleQuantityChange }: BasketItemProps) => {
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
                        <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">{item.movieTitle}</h2>
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
