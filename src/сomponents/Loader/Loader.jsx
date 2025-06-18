import styles from './Loader.module.scss';

export default function Loader({ progress }) {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.loaderBar} style={{ width: `${Math.floor(progress * 100)}%` }} />
    </div>
  );
}
