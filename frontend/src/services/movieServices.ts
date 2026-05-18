import api from "./api";

const movieServices = {
    async getAllMovies() {
        const response = await api.get("/movies/");
        return response.data;
    },
    async getNowPlayingMovies() {
        const response = await api.get("/movies/?status=now_playing");
        return response.data;
    },
    async getUpcomingMovies() {
        const response = await api.get("/movies/?status=coming_soon");
        return response.data;
    },
    async getMovieById(id: string) {
        const response = await api.get(`/movies/${id}`);
        return response.data;
    },
    async getMovieShowtimes(id: string) {
        const response = await api.get(`/movies/${id}/showtimes`);
        return response.data;
    },

    // Admin-only methods
    async createMovie(movie: any) {
        const response = await api.post("/movies/", movie);
        return response.data;
    },
    async updateMovie(id: string, movie: any) {
        const response = await api.put(`/movies/${id}`, movie);
        return response.data;
    },
    async deleteMovie(id: string) {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
    },
};

export default movieServices;