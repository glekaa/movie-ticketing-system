type Movie = {
    id: string;
    title: string;
    description: string;
    poster_url: string;
    duration_minutes: number;
    release_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    genres: string[];
};

export type { Movie };