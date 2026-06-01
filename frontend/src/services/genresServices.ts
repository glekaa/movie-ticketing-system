import api from "./api";
import type { Genre, GenreCreateDTO } from "../types";

const genresServices = {
    async getAllGenres() {
        const response = await api.get<Genre[]>("/genres/", {
            params: { limit: 100 }
        });
        return response.data;
    },
    async createGenre(data: GenreCreateDTO) {
        const response = await api.post("/genres/", data);
        return response.data;
    }
};

export default genresServices;
