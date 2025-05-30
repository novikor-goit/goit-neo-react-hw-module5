import React from 'react';
import styles from './MovieList.module.css';
import MovieCard from '../MovieCard/MovieCard';

/**
 * @param {MovieBasicDto[]} movies
 */
function MovieList({ movies }) {
  return (
    <div className={styles.container}>
      <ul className={styles.movieList}>
        {movies.map((movie) => (
          <li key={movie.id} className={styles.movieItem}>
            <MovieCard movie={movie} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieList;
