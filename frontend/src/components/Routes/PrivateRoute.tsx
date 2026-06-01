import { Outlet, Navigate } from "react-router";
import useAuthStore from "../../stores/authStore";
import LoadingState from "../LayoutElements/LoadingState";

const PrivateRoute = () => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const isInitialized = useAuthStore((state) => state.isInitialized);

    if (!isInitialized) {
        return <LoadingState />;
    }

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
