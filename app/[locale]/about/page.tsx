import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import styles from './page.module.css';

export default async function AboutPage() {
  const t = await getTranslations('common');

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t('aboutTitle')}</h1>
      <p className={styles.description}>
        {t('description')}
      </p>
      <p className={styles.author}>
        <strong>{t('author')}:</strong> <a href="https://github.com/imagineapril">imagineapril</a>
      </p>
      <p>
        <a 
          href="https://rs.school/courses/reactjs" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.courseLink}
        >
          {t('courseLink')}
        </a>
      </p>
      <Link href="/" className={styles.homeLink}>
        ← {t('backToHome')}
      </Link>
    </div>
  );
};