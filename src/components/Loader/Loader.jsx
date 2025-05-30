import { ThreeDots } from 'react-loader-spinner';
import css from './Loader.module.css';

export default function Loader({ size = 300 }) {
  return (
    <section className={css.container}>
      <ThreeDots height={size} width={size} color="orangered" />
    </section>
  );
}
