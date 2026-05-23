import Button from "../Elements/Button";
import { User, Mail } from "lucide-react";

interface CheckoutFormProps {
    name: string;
    setName: (name: string) => void;
    email: string;
    setEmail: (email: string) => void;
    formErrors: { name?: string; email?: string };
    handleCheckout: (e: React.FormEvent) => void;
    isCheckingOut: boolean;
    ticketSubtotal: number;
    bookingFeePerTicket: number;
    totalBookingFee: number;
    grandTotal: number;
}

const CheckoutForm = (props: CheckoutFormProps) => {
    const {
        name, setName,
        email, setEmail,
        formErrors,
        handleCheckout,
        isCheckingOut,
        ticketSubtotal,
        bookingFeePerTicket,
        totalBookingFee,
        grandTotal
    } = props;

    return (
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
    );
};

export default CheckoutForm;
