import styles from './Header.module.css';

const Header = () => {
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

export default Header;

