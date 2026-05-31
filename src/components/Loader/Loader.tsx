import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.pokeballLoader}>
        <div className={styles.pokeballTop} />
        <div className={styles.pokeballBottom} />
        <div className={styles.pokeballButton} />
      </div>
      <p className={styles.loaderText}>Loading Pokémon...</p>
    </div>
    );
}

export default Loader;