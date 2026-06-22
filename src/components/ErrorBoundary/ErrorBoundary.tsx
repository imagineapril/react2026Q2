import { Component } from 'react';
import { useTranslations } from 'next-intl';
import styles from './ErrorBoundary.module.css';
import Button from '../Button/Button';
import type { ErrorBoundaryProps, ErrorBoundaryState } from '../../types';

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      errorMessage: error.message,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallbackWithTranslations 
          message={this.state.errorMessage} 
          onRetry={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

const ErrorFallbackWithTranslations = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  const t = useTranslations('common');
  return (
    <div className={styles.errorContainer}>
      <h2 className={styles.errorTitle}>{t('somethingWentWrong')}</h2>
      <p className={styles.errorMessage}>{message}</p>
      <div className={styles.errorActions}>
        <Button onClick={onRetry}>
          {t('reloadPage')}
        </Button>
      </div>
    </div>
  );
};

export default ErrorBoundary;