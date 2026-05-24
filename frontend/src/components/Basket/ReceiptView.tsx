import { useNavigate } from "react-router";
import { CheckCircle, MapPin, Calendar, Clock, Ticket } from "lucide-react";
import Button from "../Elements/Button";
import type { ReceiptData } from "../../types";

interface ReceiptViewProps {
    receiptData: ReceiptData;
}

const ReceiptView = ({ receiptData }: ReceiptViewProps) => {
    const navigate = useNavigate();

    return (
        <main className="max-w-3xl mx-auto px-4 md:px-8 py-16 flex flex-col items-center">
            <section className="bg-[#1a1919] border border-white/10 rounded-3xl p-8 md:p-12 w-full text-center relative overflow-hidden shadow-2xl animate-fade-in">
                {/* Visual tickets border top/bottom */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00A3FF] to-[#0055FF]"></div>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-[#00A3FF]/10 rounded-full text-[#00A3FF] animate-pulse">
                        <CheckCircle className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-white mb-2 font-['Montserrat']">Booking Confirmed!</h1>
                <p className="text-gray-400 text-sm mb-8">We've sent your digital tickets to <span className="text-[#00A3FF] font-medium">{receiptData.customerEmail}</span></p>

                {/* Booking Ticket Card */}
                <article className="bg-[#121111] border border-white/5 rounded-2xl p-6 text-left mb-8 relative">
                    {/* Decorative side cuts for cinema ticket look */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1919] rounded-full border-r border-white/5"></div>
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1919] rounded-full border-l border-white/5"></div>

                    <div className="flex flex-row justify-between items-center border-b border-white/5 pb-4 mb-4">
                        <div>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Booking Reference</span>
                            <span className="text-white font-mono font-bold text-lg">{receiptData.bookingReference}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Date Paid</span>
                            <span className="text-white text-sm">{receiptData.date}</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {receiptData.items.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b border-white/5 pb-6 last:border-b-0 last:pb-0">
                                <img
                                    src={item.moviePosterUrl}
                                    alt={item.movieTitle}
                                    className="w-16 h-22 object-cover rounded-xl border border-white/10 shrink-0"
                                />
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-bold text-white text-base mb-1">{item.movieTitle}</h3>
                                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5 text-gray-500" /> {item.theaterName}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-gray-500" /> {item.showtimeDate}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-gray-500" /> {item.showtimeTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-[#00A3FF] bg-[#00A3FF]/10 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                            <Ticket className="w-3 h-3" /> {item.quantity} x Tickets
                                        </span>
                                        <span className="text-sm font-semibold text-white">${item.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bill Summary inside receipt */}
                    <div className="border-t border-dashed border-white/10 mt-6 pt-4 space-y-2 text-xs text-gray-400">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span className="text-white">${receiptData.ticketSubtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Booking Fee</span>
                            <span className="text-white">${receiptData.totalBookingFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/5">
                            <span>Total Paid</span>
                            <span className="text-[#00A3FF]">${receiptData.grandTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </article>

                <Button variant="primary" onClick={() => navigate("/")} className="w-full py-3.5">
                    Back to Home
                </Button>
            </section>
        </main>
    );
};

export default ReceiptView;
