import styles from './Loader.module.scss';

function Loader() {
  return (
    <div className={styles.loader_container}>
      <div className={styles.loader} />
    </div>
  );
}

export default Loader;
