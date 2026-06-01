import { lazy, Suspense, useEffect } from "react";
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout"
import { Routes, Route, Outlet } from "react-router";
import LoadingState from "./components/LayoutElements/LoadingState";
import { BasketProvider } from "./context/BasketContext";
import axios from "axios";
import api from "./services/api";
import useAuthStore from "./stores/authStore";
import PrivateRoute from "./components/Routes/PrivateRoute";

const Movies = lazy(() => import("./Pages/MoviesMain/Movies"));
const MoviePage = lazy(() => import("./Pages/MovieDetails/MoviePage"));
const AllMovies = lazy(() => import("./Pages/AllMovies/AllMovies"));
const SeatSelection = lazy(() => import("./Pages/SeatSelection/SeatSelection"));
const BasketPage = lazy(() => import("./Pages/Basket/BasketPage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));
const Cinemas = lazy(() => import("./Pages/Cinemas/Cinemas"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const MovieTable = lazy(() => import("./Pages/Admin/MoviesTable"));
const TheatersTable = lazy(() => import("./Pages/Admin/TheatersTable"));
const MovieDetails = lazy(() => import("./Pages/Admin/MovieDetails"));
const MovieCreate = lazy(() => import("./Pages/Admin/MovieCreate"));
const MovieEdit = lazy(() => import("./Pages/Admin/MovieEdit"));
const ShowtimeCreate = lazy(() => import("./Pages/Admin/ShowtimeCreate"));
const GenresTable = lazy(() => import("./Pages/Admin/GenresTable"));
const Auth = lazy(() => import("./Pages/Auth/Auth"))

const LayoutWrapper = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
)

const App = () => {
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await axios.post(
          "/api/v1/auth/refresh",
          {},
          { withCredentials: true }
        );
        const { access_token } = response.data;

        useAuthStore.setState({ token: access_token });

        const userRes = await api.get("/auth/me");

        useAuthStore.getState().login(userRes.data, access_token);
      } catch (err) {
        useAuthStore.setState({ isInitialized: true });
      }
    };

    initializeAuth();
  }, []);

  return (
    <BasketProvider>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <LoadingState />
          </div>
        }
      >
        <Routes>
          <Route element={<LayoutWrapper />}>
            <Route path="/" index element={<Movies status="now_showing" />} />
            <Route path="/coming-soon" element={<Movies status="coming_soon" />} />
            <Route path="/cinemas" element={<Cinemas />} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/movie/:id/seats/" element={<SeatSelection />} />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/auth/login" element={<Auth mode="login" />} />
          <Route path="/auth/register" element={<Auth mode="register" />} />
          {/* <Route element={<PrivateRoute />}> */}
          <Route path="/admin" element={<AdminLayoutWrapper />}>
            <Route index element={<AdminDashboard />} />
            <Route path="movies-management" element={<MovieTable />} />
            <Route path="theaters-management" element={<TheatersTable />} />
            <Route path="genres" element={<GenresTable />} />
            <Route path="movies-management/:id" element={<MovieDetails />} />
            <Route path="movies-management/:id/edit" element={<MovieEdit />} />
            <Route path="movies-management/create" element={<MovieCreate />} />
            <Route path="movies-management/:id/showtime/create" element={<ShowtimeCreate />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
          {/* </Route> */}
        </Routes>
      </Suspense>
    </BasketProvider>
  );
};

export default App;
