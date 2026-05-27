import api from "./api";
import type { Genre } from "../types";

const genresServices = {
    async getAllGenres() {
        const response = await api.get<Genre[]>("/genres/", {
            params: { limit: 100 }
        });
        return response.data;
    },
    async createGenre(data: { name: string }) {
        const response = await api.post("/genres/", data);
        return response.data;
    },
    async deleteGenre(id: string) {
        const response = await api.delete(`/genres/${id}`);
        return response.data;
    },

};

export default genresServices;
