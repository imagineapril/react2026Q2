import { Component } from 'react';
import styles from './Loader.module.css';

class Loader extends Component {
  render() {
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
}

export default Loader;