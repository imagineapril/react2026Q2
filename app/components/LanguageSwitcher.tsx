'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import styles from './LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const getPathWithoutLocale = (path: string) => {
    const segments = path.split('/');
    if (segments[1] === 'en' || segments[1] === 'ru') {
      segments.splice(1, 1);
      return segments.join('/') || '/';
    }
    return path;
  };

  const switchLanguage = (newLocale: string) => {
    if (locale === newLocale) return;
    const normalizedPathname = getPathWithoutLocale(pathname);
    router.replace(normalizedPathname, { locale: newLocale });
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.languageButton}
        onClick={() => switchLanguage('en')}
        disabled={locale === 'en'}
      >
        EN
      </button>
      <span className={styles.separator}>|</span>
      <button
        className={styles.languageButton}
        onClick={() => switchLanguage('ru')}
        disabled={locale === 'ru'}
      >
        RU
      </button>
    </div>
  );
};

export default LanguageSwitcher;