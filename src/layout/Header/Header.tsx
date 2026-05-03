import { Component } from 'react';
import styles from './Header.module.css';

class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <div className={styles.pokeballIcon}>
            <div className={styles.blackBand} />
            <div className={styles.button} />
          </div>
          <h1 className={styles.title}>Pokemon Search App</h1>
        </div>
      </header>
    );
  }
}

export default Header;

