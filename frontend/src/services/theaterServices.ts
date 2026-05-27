import api from "./api";
import type { Theater } from "../types";

const theaterServices = {
    async getAllTheaters(): Promise<Theater[]> {
        const response = await api.get("/theaters/");
        return response.data;
    },

    // Admin-only services
    async createTheater(theaterData: { name: string; location: string }) {
        const response = await api.post("/theaters/", theaterData);
        return response.data;
    },

    async updateTheater(theaterId: string, theaterData: { name: string; location: string }) {
        const response = await api.put(`/theaters/${theaterId}`, theaterData);
        return response.data;
    },

    async createScreen(theaterId: string, screenData: { name: string; total_rows: number; seats_per_row: number }) {
        const response = await api.post(`/theaters/${theaterId}/screens`, screenData);
        return response.data;
    }
};

export default theaterServices;
