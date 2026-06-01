import api from "./api";
import type { Theater, TheaterCreateDTO, TheaterUpdateDTO, ScreenCreateDTO } from "../types";

const theaterServices = {
    async getAllTheaters() {
        const response = await api.get<Theater[]>("/theaters/");
        return response.data;
    },

    // Admin-only services
    async createTheater(theaterData: TheaterCreateDTO) {
        const response = await api.post("/theaters/", theaterData);
        return response.data;
    },

    async updateTheater(theaterId: string, theaterData: TheaterUpdateDTO) {
        const response = await api.put(`/theaters/${theaterId}`, theaterData);
        return response.data;
    },

    async createScreen(theaterId: string, screenData: ScreenCreateDTO) {
        const response = await api.post(`/theaters/${theaterId}/screens`, screenData);
        return response.data;
    }
};

export default theaterServices;
