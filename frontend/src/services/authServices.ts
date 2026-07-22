import api from "./api";
import type { AuthSession, LoginFormValues, RegisterFormValues } from "../types";

const authServices = {
    async getUser(token: string) {
        // The token is passed explicitly: at login time the store has not been
        // updated yet, so the request interceptor has nothing to attach.
        const response = await api.get("/auth/me", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    },
    async login(credentials: LoginFormValues): Promise<AuthSession> {
        const params = new URLSearchParams();
        params.append("username", credentials.username);
        params.append("password", credentials.password);

        const response = await api.post("/auth/login", params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const { access_token, refresh_token } = response.data;
        const user = await this.getUser(access_token);
        return { user, token: access_token, refreshToken: refresh_token };
    },
    async register(credentials: RegisterFormValues): Promise<AuthSession> {
        await api.post("/auth/register", credentials);
        return this.login({ username: credentials.email, password: credentials.password });
    },
    async logout(refreshToken: string) {
        await api.post("/auth/logout", { refresh_token: refreshToken });
    }
}

export default authServices;
