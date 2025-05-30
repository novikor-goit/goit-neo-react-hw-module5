import React, { useEffect, useRef, useState } from 'react';
import styles from './MovieDetailsPage.module.css';
import { Link, Navigate, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import api from '../../api/tmdb.js';
import MovieCard from '../../components/MovieCard/MovieCard.jsx';
import Loader from '../../components/Loader/Loader.jsx';
import BackLink from '../../components/BackLink/BackLink.jsx';

function MovieDetailsPage() {
  const { movieId } = useParams();

  const [/** @type {MovieDetailedDto | null} */ movie, setMovie] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const backLink = useRef(location.state || '/movies');

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setMovie(await api.getMovieById(movieId));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movieId]);

  if (isLoading) return <Loader />;
  if (!movie) return <Navigate to="/" />;

  return (
    <section className={styles.container}>
      <BackLink path={backLink.current} />
      <h1>Movie Details Page</h1>
      <div>
        <div className={styles.card}>
          <MovieCard movie={movie} />
        </div>
        <p>{movie.overview}</p>
        <ul>
          <li>
            <NavLink to="cast">Cast</NavLink>
          </li>
          <li>
            <NavLink to="reviews">Reviews</NavLink>
          </li>
        </ul>
      </div>
      <section>
        <Outlet />
      </section>
    </section>
  );
}

export default MovieDetailsPage;
