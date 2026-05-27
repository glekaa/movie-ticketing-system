import { useState } from "react";
import { useNavigate } from "react-router";
import { useBasket } from "../../context/BasketContext";
import { ArrowLeft, Ticket } from "lucide-react";
import EmptyBasketState from "../../components/Basket/EmptyBasketState";
import ReceiptView from "../../components/Basket/ReceiptView";
import BasketItemCard from "../../components/Basket/BasketItemCard";
import CheckoutForm from "../../components/Basket/CheckoutForm";

const BasketPage = () => {
    const navigate = useNavigate();
    const { basket, updateQuantity, removeFromBasket, clearBasket } = useBasket();

    // Form and Checkout States
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});
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
        const errors: { name?: string; email?: string } = {};
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
        return <ReceiptView receiptData={receiptData} />;
    }

    // If basket is empty, show empty state
    if (basket.length === 0) {
        return <EmptyBasketState />;
    }

    return (
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-10 animate-fade-in">
            <div className="flex items-center gap-4 mb-8">
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
            </div>

            {/* Grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Left side: Basket items */}
                <section className="lg:col-span-2 space-y-4">
                    {basket.map((item) => (
                        <BasketItemCard
                            key={item.id}
                            item={item}
                            handleRemoveItem={handleRemoveItem}
                            handleQuantityChange={handleQuantityChange}
                        />
                    ))}
                </section>

                {/* Right side: Summary & Checkout Form */}
                <aside className="space-y-6">

                    {/* Checkout Card */}
                    <CheckoutForm
                        name={name}
                        setName={setName}
                        email={email}
                        setEmail={setEmail}
                        formErrors={formErrors}
                        handleCheckout={handleCheckout}
                        isCheckingOut={isCheckingOut}
                        ticketSubtotal={ticketSubtotal}
                        bookingFeePerTicket={bookingFeePerTicket}
                        totalBookingFee={totalBookingFee}
                        grandTotal={grandTotal}
                    />

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
