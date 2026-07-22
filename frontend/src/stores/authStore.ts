import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "../types";

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isInitialized: boolean;
    login: (user: User, token: string, refreshToken: string) => void;
    setTokens: (token: string, refreshToken: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            refreshToken: null,
            isInitialized: false,
            login: (user, token, refreshToken) =>
                set({ user, token, refreshToken, isInitialized: true }),
            setTokens: (token, refreshToken) => set({ token, refreshToken }),
            logout: () =>
                set({ user: null, token: null, refreshToken: null, isInitialized: true })
        }),
        {
            name: "cinema_auth",
            storage: createJSONStorage(() => localStorage),
            // Only the refresh token survives a reload. The access token is short-lived
            // and re-minted on boot, so there is no reason to leave it on disk.
            partialize: (state) => ({ refreshToken: state.refreshToken })
        }
    )
);

export default useAuthStore;
