'use client';

import { Link, usePathname } from '../../src/i18n/navigation';
import { useTranslations } from 'next-intl';
import ThemeSwitcher from '../../src/components/ThemeSwitcher/ThemeSwitcher';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Navbar.module.css';

const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations('common');

  return (
    <nav className={styles.nav}>
      <div className={styles.links}>
        <Link href="/" className={pathname === '/' ? styles.active : ''}>
          {t('home')}
        </Link>
        <Link href="/about" className={pathname === '/about' ? styles.active : ''}>
          {t('about')}
        </Link>
      </div>
      <ThemeSwitcher />
      <LanguageSwitcher />
    </nav>
  );
};

export default Navbar;