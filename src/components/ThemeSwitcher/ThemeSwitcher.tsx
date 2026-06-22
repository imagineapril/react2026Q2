'use client';
import { useTheme } from '../../context/ThemeContext';
import { useTranslations } from 'next-intl';
import styles from './ThemeSwitcher.module.css';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations('theme');

  return (
    <button className={styles.switcher} onClick={toggleTheme}>
      {theme === 'light' ? t('dark') : t('light')}
    </button>
  );
};

export default ThemeSwitcher;