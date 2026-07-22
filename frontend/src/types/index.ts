// ==========================================
// Genre Types
// ==========================================
export type Genre = {
    id: string;
    name: string;
    slug: string;
};

export type GenreCreateDTO = {
    name: string;
    slug: string;
};

export type { GenreCreateForm } from "../schemas/genresSchemas";

// ==========================================
// Person (Cast / Crew) Types
// ==========================================
export type Person = {
    name: string;
    profile_url: string | null;
    character: string | null;
    job: string | null;
};

// ==========================================
// Movie Types & DTOs
// ==========================================
export type Movie = {
    id: string;
    title: string;
    description: string;
    poster_url: string;
    backdrop_url: string;
    age_rating: number;
    duration_minutes: number;
    release_date: string;
    status: string;
    created_at: string;
    updated_at: string;
    genres: Genre[];
    director: Person | null;
    actors: Person[] | null;
    tmdb_rating: number | null;
    plot: string | null;
    language: string | null;
};

export type MovieCreateDTO = {
    title: string;
    description: string;
    poster_url: string;
    backdrop_url: string;
    duration_minutes: number;
    age_rating: number;
    release_date: string;
    status: string;
    genre_ids: string[];
};

export type MovieUpdateDTO = Partial<MovieCreateDTO>;

export type { MovieCreateForm } from "../schemas/moviesSchemes";

// ==========================================
// Theater & Screen Types
// ==========================================
export type Screen = {
    id: string;
    name: string;
    total_rows: number;
    seats_per_row: number;
    capacity?: number;
    theater_id?: string;
};

export type Theater = {
    id: string;
    name: string;
    location: string;
    screens: Screen[];
};

export type TheaterCreateDTO = {
    name: string;
    location: string;
};

export type TheaterUpdateDTO = Partial<TheaterCreateDTO>;

export type ScreenCreateDTO = {
    name: string;
    total_rows: number;
    seats_per_row: number;
};

export type { TheaterCreateForm, ScreenCreateForm } from "../schemas/theatersSchemas";

// ==========================================
// Showtime Types
// ==========================================
export type Showtime = {
    id: string;
    start_time: string;
    end_time: string;
    base_price: string;
    status: string;
    screen_id: string;
    movie_id: string;
};

export type ShowtimeCreateDTO = {
    start_time: string;
    end_time: string;
    base_price: number;
    status: string;
    screen_id: string;
    movie_id: string;
};

// ==========================================
// Basket & Context Types
// ==========================================
export type BasketItem = {
    id: string;
    movieId: string;
    movieTitle: string;
    moviePosterUrl: string;
    movieDurationMinutes: number;
    showtimeId: string;
    showtimeTime: string;
    showtimeDate: string;
    theaterName: string;
    quantity: number;
    ticketPrice: number;
    totalPrice: number;
    seats?: string[];
    expiresAt?: number;
};

export type BasketContextType = {
    basket: BasketItem[];
    addToBasket: (item: Omit<BasketItem, "id" | "totalPrice">) => void;
    updateQuantity: (itemId: string, newQuantity: number) => void;
    removeFromBasket: (itemId: string) => void;
    clearBasket: () => void;
};

// ==========================================
// Receipt & Billing Types
// ==========================================
export type ReceiptItem = {
    id: string;
    moviePosterUrl: string;
    movieTitle: string;
    theaterName: string;
    showtimeDate: string;
    showtimeTime: string;
    quantity: number;
    totalPrice: number;
};

export type ReceiptData = {
    customerName: string;
    customerEmail: string;
    bookingReference: string;
    date: string;
    items: ReceiptItem[];
    ticketSubtotal: number;
    totalBookingFee: number;
    grandTotal: number;
};

export type { CheckoutFormValues } from "../schemas/checkoutSchemas";

// ==========================================
// Auth
// ==========================================

export type User = {
    email: string;
    username: string;
    id: string;
    role: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

// Wire format returned by POST /auth/login and POST /auth/refresh.
export type TokenPair = {
    access_token: string;
    refresh_token: string;
    token_type: string;
};

// What the app holds once a user is signed in.
export type AuthSession = {
    user: User;
    token: string;
    refreshToken: string;
};

export type { RegisterFormValues, LoginFormValues } from "../schemas/authSchemas";