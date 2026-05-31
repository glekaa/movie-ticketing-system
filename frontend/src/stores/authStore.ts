import { create } from "zustand";
import type { User } from "../types";

interface AuthState {
    user: User | null;
    token: string | null;
    isInitialized: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;

}

const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isInitialized: false,
    login: (user, token) => set({ user, token, isInitialized: true }),
    logout: () => set({ user: null, token: null, isInitialized: true })
}));

export default useAuthStore;