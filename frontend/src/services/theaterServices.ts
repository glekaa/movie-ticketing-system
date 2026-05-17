import { apiTheaters } from "./api";

const theaterServices = {
    async getAllTheaters() {
        const response = await apiTheaters.get("/");
        return response.data;
    },
};

export { theaterServices };
