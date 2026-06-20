'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from '../../src/components/ThemeSwitcher/ThemeSwitcher';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.links}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>
          Home
        </Link>
        <Link href="/about" className={pathname === '/about' ? styles.active : ''}>
          About
        </Link>
      </div>
      <ThemeSwitcher />
    </nav>
  );
};

export default Navbar;