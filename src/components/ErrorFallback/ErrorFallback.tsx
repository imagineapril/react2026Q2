import styles from './ErrorFallback.module.css';

interface ErrorFallbackProps {
  message: string;
  onRetry: () => void;
}

const ErrorFallback = ({ message, onRetry }: ErrorFallbackProps) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>⚠️</div>
      <h3 className={styles.errorTitle}>Oops! Something went wrong</h3>
      <p className={styles.errorMessage}>{message}</p>
      <button className={styles.retryButton} onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;