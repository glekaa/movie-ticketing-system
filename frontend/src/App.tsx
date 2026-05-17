import { lazy, Suspense } from 'react';
import Layout from './Layout/Layout';
import { Routes, Route } from "react-router"
import { Loader2 } from "lucide-react";

const Movies = lazy(() => import("./Pages/Movies/Movies"))
const NotFound = lazy(() => import("./Pages/NotFound/NotFound"))

const App = () => {
  return (
    <Layout>
      <Suspense fallback={
        <div className="flex items-center justify-center gap-4 h-screen">
          <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" index element={<Movies status="now_showing" />} />
          <Route path="/coming-soon" element={<Movies status="coming_soon" />} />
          <Route path="/cinemas" element={<div>Cinemas</div>} />
          <Route path="/movie/:id" element={<div>Movie Detail (Coming Soon)</div>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}

export default App