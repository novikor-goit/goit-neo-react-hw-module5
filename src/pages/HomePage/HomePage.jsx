import React, { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import api from '../../api/tmdb.js';
import MovieList from '../../components/MovieList/MovieList';
import Loader from '../../components/Loader/Loader';

function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const movies = await api.getTrendingMovies();
        setTrendingMovies(movies);
      } catch (error) {
        console.error('Error fetching trending movies:', error);
        setError('Failed to fetch trending movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Today's Trending Movies</h1>

      {isLoading && <Loader />}

      {error && <p className={styles.error}>{error}</p>}

      {!isLoading && !error && trendingMovies.length > 0 && <MovieList movies={trendingMovies} />}

      {!isLoading && !error && trendingMovies.length === 0 && (
        <p className={styles.noMovies}>No trending movies found</p>
      )}
    </div>
  );
}

export default HomePage;
