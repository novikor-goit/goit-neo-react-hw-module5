import React, { useEffect, useState } from 'react';
import styles from './MovieReviews.module.css';
import api from '../../api/tmdb.js';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';

function MovieReviews() {
  const { movieId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setReviews(await api.getMovieReviews(movieId));
      } catch (error) {
        setError(error);
        console.error('Error fetching movie reviews:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movieId]);

  if (isLoading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Movie Reviews</h2>
      {reviews.length > 0 ? (
        <ul className={styles.reviewsList}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.reviewItem}>
              <p className={styles.reviewAuthor}>{review.author}</p>
              <p className={styles.reviewContent}>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReviews}>No reviews yet</p>
      )}
    </div>
  );
}

export default MovieReviews;
