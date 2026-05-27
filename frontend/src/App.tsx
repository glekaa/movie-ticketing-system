import { lazy, Suspense } from "react";
import Layout from "./Layout/Layout";
import AdminLayout from "./Layout/AdminLayout"
import { Routes, Route, Outlet } from "react-router";
import LoadingState from "./components/LayoutElements/LoadingState";
import { BasketProvider } from "./context/BasketContext";

const Movies = lazy(() => import("./Pages/MoviesMain/Movies"));
const MoviePage = lazy(() => import("./Pages/MovieDetails/MoviePage"));
const AllMovies = lazy(() => import("./Pages/AllMovies/AllMovies"));
const SeatSelection = lazy(() => import("./Pages/SeatSelection/SeatSelection"));
const BasketPage = lazy(() => import("./Pages/Basket/BasketPage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));
const MovieTable = lazy(() => import("./Pages/Admin/MoviesTable"));
const TheatersTable = lazy(() => import("./Pages/Admin/TheatersTable"));
const MovieDetails = lazy(() => import("./Pages/Admin/MovieDetails"));
const MovieCreate = lazy(() => import("./Pages/Admin/MovieCreate"));
const MovieEdit = lazy(() => import("./Pages/Admin/MovieEdit"));
const ShowtimeCreate = lazy(() => import("./Pages/Admin/ShowtimeCreate"));

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
            <Route path="/cinemas" element={<div>Cinemas</div>} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/movie/:id/seats/" element={<SeatSelection />} />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminLayoutWrapper />}>
            <Route index element={<AdminDashboard />} />
            <Route path="movies-management" element={<MovieTable />} />
            <Route path="theaters-management" element={<TheatersTable />} />
            <Route path="movies-management/:id" element={<MovieDetails />} />
            <Route path="movies-management/:id/edit" element={<MovieEdit />} />
            <Route path="movies-management/create" element={<MovieCreate />} />
            <Route path="movies-management/:id/showtime/create" element={<ShowtimeCreate />} />
            <Route path="*" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </BasketProvider>
  );
};

export default App;
