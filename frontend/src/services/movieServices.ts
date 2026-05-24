import api from "./api";
import type { MovieCreateDTO, MovieUpdateDTO } from "../types";

export interface MovieFilters {
    skip?: number;
    limit?: number;
    genres?: string[];
    status?: string;
}

const movieServices = {
    async getAllMovies(filters?: MovieFilters) {
        const params = new URLSearchParams();
        if (filters?.skip !== undefined) params.append('skip', filters.skip.toString());
        if (filters?.limit !== undefined) params.append('limit', filters.limit.toString());
        if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
        if (filters?.genres && filters.genres.length > 0) {
            filters.genres.forEach(g => params.append('genres', g));
        }

        const queryString = params.toString();
        const url = queryString ? `/movies/?${queryString}` : "/movies/";
        const response = await api.get(url);
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
    async createMovie(movie: MovieCreateDTO) {
        const response = await api.post("/movies/", movie);
        return response.data;
    },
    async updateMovie(id: string, movie: MovieUpdateDTO) {
        const response = await api.put(`/movies/${id}`, movie);
        return response.data;
    },
    async deleteMovie(id: string) {
        const response = await api.delete(`/movies/${id}`);
        return response.data;
    },
};

export default movieServices;