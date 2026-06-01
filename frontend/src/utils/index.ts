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

const CITY_MAPPING: Record<string, string> = {
    warszaw: "Warsaw", warsaw: "Warsaw",
    krakow: "Kraków", kraków: "Kraków",
    gdansk: "Gdańsk", gdańsk: "Gdańsk",
    wroclaw: "Wrocław", wrocław: "Wrocław",
    poznan: "Poznań", poznań: "Poznań",
    lodz: "Łódź", łódź: "Łódź",
    katowice: "Katowice",
    szczecin: "Szczecin",
    bydgoszcz: "Bydgoszcz",
    lublin: "Lublin",
    bialystok: "Białystok", białystok: "Białystok",
    rzeszow: "Rzeszów", rzeszów: "Rzeszów",
    gdynia: "Gdynia",
    sopot: "Sopot",
    torun: "Toruń", toruń: "Toruń"
};

export const getCityFromLocation = (location: string): string => {
    for (const key of Object.keys(CITY_MAPPING)) {
        if (location.toLowerCase().includes(key)) {
            return CITY_MAPPING[key];
        }
    }
    return "No location found";
};