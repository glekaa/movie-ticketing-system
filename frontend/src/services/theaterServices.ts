import api from "./api";

const theaterServices = {
    async getAllTheaters() {
        const response = await api.get("/theaters/");
        return response.data;
    },
};

export default theaterServices;
