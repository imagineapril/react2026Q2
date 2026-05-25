import { Outlet, Link } from 'react-router-dom';
import Header from '../Header/Header';
import ThemeSwitcher from '../../components/ThemeSwitcher/ThemeSwitcher';
import styles from './RootLayout.module.css';

const RootLayout = () => {
  return (
    <div>
      <Header />
      <nav className={styles.nav}>
        <div className={styles.links}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </div>
        <ThemeSwitcher />
      </nav>
      <Outlet />
    </div>
  );
};

export default RootLayout;