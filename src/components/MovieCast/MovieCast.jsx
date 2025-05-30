import React, { useEffect, useState } from 'react';
import styles from './MovieCast.module.css';
import api from '../../api/tmdb.js';
import { useParams } from 'react-router-dom';
import Loader from '../Loader/Loader.jsx';

function MovieCast() {
  const { movieId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cast, setCast] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        setCast(await api.getMovieCast(movieId));
      } catch (error) {
        setError(error);
        console.error('Error fetching movie cast:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [movieId]);

  if (isLoading) return <Loader />;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h2>Movie Cast</h2>
      {cast.length > 0 ? (
        <ul className={styles.castList}>
          {cast.map((castMember) => (
            <li key={castMember.id} className={styles.castMember}>
              <img
                src={castMember.profile_path}
                alt={`${castMember.name} profile`}
                className={styles.castMemberImage}
              />
              <p className={styles.castMemberName}>{castMember.name}</p>
              <p className={styles.castMemberCharacter}>{castMember.character}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noCast}>No cast found</p>
      )}
    </div>
  );
}

export default MovieCast;
