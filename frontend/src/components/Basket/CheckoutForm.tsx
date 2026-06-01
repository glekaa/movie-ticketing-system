import Button from "../Elements/Button";
import { FormInput } from "../Elements/FormElements";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { CheckoutFormValues } from "../../types";

interface CheckoutFormProps {
    register: UseFormRegister<CheckoutFormValues>;
    errors: FieldErrors<CheckoutFormValues>;
    onSubmit: () => void;
    isCheckingOut: boolean;
    ticketSubtotal: number;
    bookingFeePerTicket: number;
    totalBookingFee: number;
    grandTotal: number;
}

export const CheckoutForm = ({
    register,
    errors,
    onSubmit,
    isCheckingOut,
    ticketSubtotal,
    bookingFeePerTicket,
    totalBookingFee,
    grandTotal
}: CheckoutFormProps) => {
    return (
        <div className="bg-[#1a1919] border border-white/5 rounded-2xl p-6 shadow-lg">
            <h2 className="text-lg font-bold text-white mb-4 font-['Montserrat']">Customer Details</h2>

            <form onSubmit={onSubmit} className="space-y-4">
                <FormInput
                    label="Full Name"
                    placeholder="John Doe"
                    error={errors.name?.message}
                    disabled={isCheckingOut}
                    {...register("name")}
                />

                <FormInput
                    label="Email Address"
                    type="email"
                    placeholder="johndoe@example.com"
                    error={errors.email?.message}
                    disabled={isCheckingOut}
                    {...register("email")}
                />

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
                        <>Processing...</>
                    ) : "Complete Booking"}
                </Button>
            </form>
        </div>
    );
};

export default CheckoutForm;
