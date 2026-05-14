import axios from "axios";

const apiMovies = axios.create({
    baseURL: "http://localhost:8002/api/v1/movies",
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiMovies;