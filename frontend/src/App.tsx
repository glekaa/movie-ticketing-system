import { lazy, Suspense } from "react";
import Layout from "./Layout/Layout";
import { Routes, Route } from "react-router";
import LoadingState from "./components/LoadingState";

const Movies = lazy(() => import("./Pages/Movies/Movies"));
const MoviePage = lazy(() => import("./Pages/Movies/MoviePage"));
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"));

const App = () => {
  return (
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

export default App;
