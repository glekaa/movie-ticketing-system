import { useState } from "react";
import { useNavigate } from "react-router";
import { useBasket } from "../../context/BasketContext";
import Button from "../../components/Button";
import { 
    Trash2, 
    Calendar, 
    Clock, 
    MapPin, 
    ArrowLeft, 
    CheckCircle, 
    Ticket,
    Mail,
    User
} from "lucide-react";
import { formatDuration } from "../../utils";

const BasketPage = () => {
    const navigate = useNavigate();
    const { basket, updateQuantity, removeFromBasket, clearBasket } = useBasket();
    
    // Form and Checkout States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [formErrors, setFormErrors] = useState<{name?: string; email?: string}>({});
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    // Calculate totals
    const ticketSubtotal = basket.reduce((acc, item) => acc + item.totalPrice, 0);
    const bookingFeePerTicket = 1.50;
    const totalTicketsCount = basket.reduce((acc, item) => acc + item.quantity, 0);
    const totalBookingFee = totalTicketsCount * bookingFeePerTicket;
    const grandTotal = ticketSubtotal + totalBookingFee;

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        updateQuantity(itemId, newQuantity);
    };

    const handleRemoveItem = (itemId: string) => {
        removeFromBasket(itemId);
    };

    const validateForm = () => {
        const errors: {name?: string; email?: string} = {};
        if (!name.trim()) errors.name = "Name is required";
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Please enter a valid email address";
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsCheckingOut(true);

        // Simulate API payment/booking request
        setTimeout(() => {
            setIsCheckingOut(false);
            setReceiptData({
                customerName: name,
                customerEmail: email,
                items: [...basket],
                ticketSubtotal,
                totalBookingFee,
                grandTotal,
                bookingReference: `BK-${Math.floor(100000 + Math.random() * 900000)}`,
                date: new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                })
            });
            setShowReceipt(true);
            clearBasket();
        }, 1500);
    };

    // If checkout is successful, show receipt view
    if (showReceipt && receiptData) {
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
                            {receiptData.items.map((item: any) => (
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
    }

    // If basket is empty, show empty state
    if (basket.length === 0) {
        return (
            <main className="max-w-4xl mx-auto px-4 md:px-8 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
                <div className="mb-8 p-6 bg-white/5 rounded-full text-gray-500 border border-white/5 animate-pulse">
                    <Ticket className="w-16 h-16" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3 font-['Montserrat']">Your Basket is Empty</h1>
                <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                    You haven't selected any movie tickets yet. Browse our selection of now playing movies and book your session!
                </p>
                <Button variant="primary" onClick={() => navigate("/")} className="px-8 py-3">
                    Explore Movies
                </Button>
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
            <header className="flex items-center gap-4 mb-8">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 rounded-full border border-white/10 hover:bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white font-['Montserrat'] tracking-wide">Ticket Basket</h1>
                    <p className="text-xs text-gray-400">Review your ticket reservations and complete your booking</p>
                </div>
            </header>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Left side: Basket items */}
                <section className="lg:col-span-2 space-y-4">
                    {basket.map((item) => (
                        <article 
                            key={item.id}
                            className="bg-[#1a1919] border border-white/5 hover:border-white/10 rounded-2xl p-5 md:p-6 transition-all duration-300 flex flex-col sm:flex-row gap-5"
                        >
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
                    ))}
                </section>

                {/* Right side: Summary & Checkout Form */}
                <aside className="space-y-6">
                    
                    {/* Checkout Card */}
                    <div className="bg-[#1a1919] border border-white/5 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-bold text-white mb-4 font-['Montserrat']">Customer Details</h2>
                        
                        <form onSubmit={handleCheckout} className="space-y-4">
                            <div className="space-y-1">
                                <label htmlFor="checkout-name" className="text-xs text-gray-400 font-semibold block">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        id="checkout-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-[#121111] border border-white/5 focus:border-[#00A3FF] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                                        placeholder="John Doe"
                                    />
                                </div>
                                {formErrors.name && (
                                    <p className="text-[10px] text-[#FF3B30] font-medium mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label htmlFor="checkout-email" className="text-xs text-gray-400 font-semibold block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input 
                                        id="checkout-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[#121111] border border-white/5 focus:border-[#00A3FF] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600"
                                        placeholder="johndoe@example.com"
                                    />
                                </div>
                                {formErrors.email && (
                                    <p className="text-[10px] text-[#FF3B30] font-medium mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Summary Totals */}
                            <section className="border-t border-white/5 pt-4 mt-6 space-y-2 text-xs text-gray-400">
                                <div className="flex justify-between">
                                    <span>Tickets Subtotal</span>
                                    <span className="text-white">${ticketSubtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Booking Fee (${bookingFeePerTicket.toFixed(2)} / ticket)</span>
                                    <span className="text-white">${totalBookingFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/5">
                                    <span>Total Price</span>
                                    <span className="text-[#00A3FF] font-['Montserrat']">${grandTotal.toFixed(2)}</span>
                                </div>
                            </section>

                            <Button 
                                type="submit" 
                                className="w-full py-3.5 mt-6 text-sm flex items-center justify-center gap-2" 
                                variant="primary"
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                    </span>
                                ) : "Complete Booking"}
                            </Button>
                        </form>
                    </div>

                    {/* Booking Guarantee Callout */}
                    <div className="bg-[#1a1919] border border-[#00A3FF]/10 rounded-2xl p-4 flex gap-3 text-xs text-gray-400">
                        <Ticket className="w-5 h-5 text-[#00A3FF] shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-white block mb-1">Instant digital delivery</span>
                            Show your QR code from your email at the cinema entrance. No physical printing needed.
                        </div>
                    </div>
                </aside>
            </div>
        </main>
    );
};

export default BasketPage;
