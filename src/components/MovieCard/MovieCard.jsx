import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './MovieCard.module.css';

/**
 * @param {MovieBasicDto} movie - MovieBasicDto object containing movie data
 */
function MovieCard({ movie }) {
  return (
    <div className={styles.movieCard}>
      <Link to={`/movies/${movie.id}`} state={useLocation()} className={styles.movieLink}>
        <div className={styles.posterContainer}>
          <img src={movie.poster} alt={`${movie.title} poster`} className={styles.poster} />
          <div className={styles.rating}>
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </div>
        </div>
        <h3 className={styles.title}>{movie.title}</h3>
      </Link>
    </div>
  );
}

export default MovieCard;
