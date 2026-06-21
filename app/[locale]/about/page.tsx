import Link from 'next/link';
import { useTranslations } from 'next-intl';
import styles from './page.module.css';

const AboutPage = () => {
  const t = useTranslations('common');

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

export default AboutPage;