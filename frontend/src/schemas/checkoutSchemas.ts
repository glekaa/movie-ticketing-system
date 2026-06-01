import z from "zod";

export const checkoutSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
