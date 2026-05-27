import api from "./api";
import type { Showtime, ShowtimeCreateDTO } from "../types";

const showtimeServices = {
    async getAllShowtimes() {
        const response = await api.get("/showtimes");
        return response.data as Showtime[];
    },

    async createShowtime(data: ShowtimeCreateDTO) {
        const response = await api.post("/showtimes", data);
        return response.data as Showtime;
    },

    async deleteShowtime(id: string) {
        const response = await api.delete(`/showtimes/${id}`);
        return response.data;
    }
};

export default showtimeServices;
