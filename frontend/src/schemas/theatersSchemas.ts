import z from "zod";

export const theaterCreateSchema = z.object({
    name: z.string().min(1, "Theater name is required"),
    location: z.string().min(1, "Location is required"),
});

export type TheaterCreateForm = z.infer<typeof theaterCreateSchema>;

export const screenCreateSchema = z.object({
    name: z.string().min(1, "Screen name is required"),
    total_rows: z.number().int().min(1, "Must be at least 1 row").max(50, "Maximum of 50 rows"),
    seats_per_row: z.number().int().min(1, "Must be at least 1 seat per row").max(50, "Maximum of 50 seats per row"),
});

export type ScreenCreateForm = z.infer<typeof screenCreateSchema>;
