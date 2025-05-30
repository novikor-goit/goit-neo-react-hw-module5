import { Toaster } from 'react-hot-toast';
import { Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Navigation } from '../Navigation/Navigation.jsx';
import Loader from '../Loader/Loader.jsx';

const App = () => {
  const HomePage = lazy(() => import('../../pages/HomePage/HomePage.jsx'));
  const MoviesPage = lazy(() => import('../../pages/MoviesPage/MoviesPage.jsx'));
  const MovieDetailsPage = lazy(() => import('../../pages/MovieDetailsPage/MovieDetailsPage.jsx'));
  const NotFoundPage = lazy(() => import('../../pages/NotFoundPage/NotFoundPage.jsx'));
  const MovieCast = lazy(() => import('../../components/MovieCast/MovieCast.jsx'));
  const MovieReviews = lazy(() => import('../../components/MovieReviews/MovieReviews.jsx'));

  return (
    <main>
      <Toaster />
      <Navigation />
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/movies/:movieId" element={<MovieDetailsPage />}>
            <Route path="cast" element={<MovieCast />} />
            <Route path="reviews" element={<MovieReviews />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </main>
  );
};

export default App;
