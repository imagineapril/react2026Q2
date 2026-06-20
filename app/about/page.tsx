import Link from 'next/link';
import styles from './page.module.css';

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Pokemon Search App</h1>
      <p className={styles.description}>
        This application demonstrates React Router, pagination, and master-detail view using the PokeAPI.
      </p>
      <p className={styles.author}>
        <strong>Author:</strong> <a href="https://github.com/imagineapril">imagineapril</a>
      </p>
      <p>
        <a 
          href="https://rs.school/courses/reactjs" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.courseLink}
        >
          RS School React Course
        </a>
      </p>
      <Link href="/" className={styles.homeLink}>
        ← Back to Home
      </Link>
    </div>
  );
};

export default AboutPage;