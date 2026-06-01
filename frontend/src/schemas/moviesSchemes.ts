import z from "zod";

export const movieCreateSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    poster_url: z.string().min(1, "Poster URL is required"),
    backdrop_url: z.string().min(1, "Backdrop URL is required"),
    duration_minutes: z.number().int().min(1, "Duration must be at least 1 minute"),
    age_rating: z.number().int().nonnegative("Age rating must be a positive number or zero"),
    release_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Release date must be in YYYY-MM-DD format"),
    status: z.enum(["now_showing", "coming_soon", "archived"]),
    genre_ids: z.array(z.string()).min(1, "Select at least one genre")
});

export type MovieCreateForm = z.infer<typeof movieCreateSchema>;