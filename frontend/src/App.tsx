import { lazy, Suspense } from "react";
import Layout from "./Layout/Layout";
import { Routes, Route, Outlet } from "react-router";
import LoadingState from "./components/LayoutElements/LoadingState";
import { BasketProvider } from "./context/BasketContext";

const Movies = lazy(() => import("./Pages/MoviesMain/Movies"));
const MoviePage = lazy(() => import("./Pages/MovieDetails/MoviePage"));
const AllMovies = lazy(() => import("./Pages/AllMovies/AllMovies"));
const BasketPage = lazy(() => import("./Pages/Basket/BasketPage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));
const AdminDashboard = lazy(() => import("./Pages/Admin/AdminDashboard"));

const MainLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

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
          <Route element={<MainLayout />}>
            <Route path="/" index element={<Movies status="now_showing" />} />
            <Route path="/coming-soon" element={<Movies status="coming_soon" />} />
            <Route path="/cinemas" element={<div>Cinemas</div>} />
            <Route path="/movie/:id" element={<MoviePage />} />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
    </BasketProvider>
  );
};

export default App;
