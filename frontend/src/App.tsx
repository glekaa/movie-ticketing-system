import { lazy, Suspense } from "react";
import Layout from "./Layout/Layout";
import { Routes, Route } from "react-router";
import LoadingState from "./components/LoadingState";
import { BasketProvider } from "./context/BasketContext";

const Movies = lazy(() => import("./Pages/Movies/Movies"));
const MoviePage = lazy(() => import("./Pages/Movies/MoviePage"));
const AllMovies = lazy(() => import("./Pages/AllMovies/AllMovies"));
const BasketPage = lazy(() => import("./Pages/Basket/BasketPage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

const App = () => {
  return (
    <BasketProvider>
      <Layout>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen">
              <LoadingState />
            </div>
          }
        >
          <Routes>
            <Route path="/" index element={<Movies status="now_showing" />} />
            <Route
              path="/coming-soon"
              element={<Movies status="coming_soon" />}
            />
            <Route path="/cinemas" element={<div>Cinemas</div>} />
            <Route
              path="/movie/:id"
              element={<MoviePage />}
            />
            <Route path="/movies" element={<AllMovies />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BasketProvider>
  );
};

export default App;
