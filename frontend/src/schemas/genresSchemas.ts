import z from "zod";

export const genreCreateSchema = z.object({
    name: z.string().min(2, "Genre name must be at least 2 characters long."),
})

export type GenreCreateForm = z.infer<typeof genreCreateSchema>;