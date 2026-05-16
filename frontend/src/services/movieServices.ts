import apiMovies from "./api";

const movieUserServices = {
    async getAllMovies() {
        const response = await apiMovies.get("/");
        return response.data;
    },
    async getNowPlayingMovies() {
        const response = await apiMovies.get("/?status=now-playing");
        return response.data;
    },
    async getUpcomingMovies() {
        const response = await apiMovies.get("/?status=upcoming");
        return response.data;
    },
    async getMovieById(id: string) {
        const response = await apiMovies.get(`/${id}`);
        return response.data;
    },
};

const movieAdminServices = {
    async getAllMovies() {
        const response = await apiMovies.get("/");
        return response.data;
    },
    async getMovieById(id: string) {
        const response = await apiMovies.get(`/${id}`);
        return response.data;
    },
    async createMovie(movie: any) {
        const response = await apiMovies.post("/", movie);
        return response.data;
    },
    async updateMovie(id: string, movie: any) {
        const response = await apiMovies.put(`/${id}`, movie);
        return response.data;
    },
    async deleteMovie(id: string) {
        const response = await apiMovies.delete(`/${id}`);
        return response.data;
    },
};

export { movieUserServices, movieAdminServices };