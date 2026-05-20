export const FILTER_DATE_OPTIONS = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "tomorrow", label: "Tomorrow" },
    { value: "weekend", label: "Weekend" },
] as const;

export const FILTER_GENRE_OPTIONS = [
    { value: "all", label: "All Genres" },
    { value: "action", label: "Action" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "thriller", label: "Thriller" },
    { value: "animation", label: "Animation" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "fantasy", label: "Fantasy" },
    { value: "romance", label: "Romance" },
    { value: "family", label: "Family" },
    { value: "adventure", label: "Adventure" },
    { value: "mystery", label: "Mystery" },
    { value: "crime", label: "Crime" },
    { value: "history", label: "History" },
    { value: "war", label: "War" },
    { value: "biography", label: "Biography" },
    { value: "documentary", label: "Documentary" },
] as const;

export const FILTER_AGE_OPTIONS = [
    { value: "G", label: "G - General Audiences" },
    { value: "PG", label: "PG - Parental Guidance" },
    { value: "PG-13", label: "PG-13 - Parents Strongly Cautioned" },
    { value: "R", label: "R - Restricted" },
    { value: "NC-17", label: "NC-17 - Adults Only" },
] as const;