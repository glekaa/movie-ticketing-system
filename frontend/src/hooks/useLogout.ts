import { useNavigate } from "react-router";
import useAuthStore from "../stores/authStore";
import authServices from "../services/authServices";

/**
 * Signs the user out on the server before clearing local state, so the refresh
 * token is actually revoked rather than just forgotten by this browser.
 */
const useLogout = () => {
    const navigate = useNavigate();

    return async () => {
        const { refreshToken, logout } = useAuthStore.getState();

        if (refreshToken) {
            try {
                await authServices.logout(refreshToken);
            } catch {
                // Already expired or revoked server-side. Clearing locally is
                // still the correct outcome, so never block sign-out on this.
            }
        }

        logout();
        navigate("/");
    };
};

export default useLogout;
