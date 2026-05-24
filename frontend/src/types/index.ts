export type Genre = {
    id: string;
    name: string;
    slug: string;
};

export type Person = {
    name: string;
    profile_url: string | null;
    character: string | null;
    job: string | null;
};

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

export type Showtime = {
    id: string;
    start_time: string;
    end_time: string;
    base_price: string;
    status: string;
    screen_id: string;
};

export type Screen = {
    id: string;
    name: string;
    capacity: number;
    theater_id: string;
};

export type Theater = {
    id: string;
    name: string;
    location: string;
    screens: Screen[];
};

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
};

export type BasketContextType = {
    basket: BasketItem[];
    addToBasket: (item: Omit<BasketItem, "id" | "totalPrice">) => void;
    updateQuantity: (itemId: string, newQuantity: number) => void;
    removeFromBasket: (itemId: string) => void;
    clearBasket: () => void;
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
