import React, { useState, useEffect } from 'react';
import styles from './MoviesPage.module.css';
import api from '../../api/tmdb.js';
import MovieList from '../../components/MovieList/MovieList';
import Loader from '../../components/Loader/Loader';
import { useSearchParams } from 'react-router-dom';

const QUERY_PARAM_KEY = 'q';

function MoviesPage() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const searchTerm = urlSearchParams.get(QUERY_PARAM_KEY);
        const movies = searchTerm ? await api.searchMovies(searchTerm) : [];
        setMovies(movies);
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Failed to search movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [urlSearchParams]);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = event.target.elements[QUERY_PARAM_KEY]?.value.trim();
    setUrlSearchParams({ [QUERY_PARAM_KEY]: query });
  };

  return (
    <div className={styles.container}>
      <div>
        <form onSubmit={submitSearch}>
          <input type="text" name={QUERY_PARAM_KEY} required placeholder="Enter search query" />
          <button type="submit">Search</button>
        </form>
      </div>

      {isLoading && <Loader />}

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {movies.length > 0 ? (
        <MovieList movies={movies} />
      ) : (
        !isLoading && urlSearchParams.get(QUERY_PARAM_KEY) && <p>Nothing found</p>
      )}
    </div>
  );
}

export default MoviesPage;
