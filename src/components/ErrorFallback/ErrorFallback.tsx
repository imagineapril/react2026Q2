'use client';

import { useTranslations } from 'next-intl';
import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
}

const ErrorFallback = ({ message, onRetry }: ErrorFallbackProps) => {

  const t = useTranslations('common');

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>{t('somethingWentWrong')}</h3>
      <p className={styles.errorMessage}>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        {t('tryAgain')}
      </button>
    </div>
  );
};

export default ErrorFallback;