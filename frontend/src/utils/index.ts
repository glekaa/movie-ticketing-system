import type { Movie } from "../types";

export const formatDuration = (minutes: number): string => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const buildMovieTags = (movie: Movie) => {
    const genreTags = movie.genres?.length
        ? movie.genres.map(g => ({ type: "primary" as const, text: g.name }))
        : [{ type: "primary" as const, text: "Uncategorized" }];

    const durationTag = { type: "primary" as const, text: formatDuration(movie.duration_minutes) };

    const ageRatingTag = movie.age_rating
        ? [{ type: "secondary" as const, text: `${movie.age_rating}+` }]
        : [];

    return [...genreTags, durationTag, ...ageRatingTag];
};