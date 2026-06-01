import api from "./api";
import type { LoginFormValues, RegisterFormValues } from "../types";

const authServices = {
    async getUser(token: string) {
        const response = await api.get("/auth/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    },
    async login(credentials: LoginFormValues) {
        const params = new URLSearchParams();
        params.append("username", credentials.username);
        params.append("password", credentials.password);

        const response = await api.post("/auth/login", params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            withCredentials: true
        });
        const token = response.data.access_token;
        const user = await this.getUser(token);
        return { user, token };
    },
    async register(credentials: RegisterFormValues) {
        await api.post("/auth/register", credentials, { withCredentials: true });
        return this.login({ username: credentials.email, password: credentials.password });
    }
}

export default authServices;