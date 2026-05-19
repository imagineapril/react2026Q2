import { useState } from 'react';
import styles from './Button.module.css';

const ErrorTestButton = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
      throw new Error('Test error');
    }

  const handleThrowError = () => {
    setShouldThrow(true);
  };

  return (
    <button className={styles.button} onClick={handleThrowError}>
      Test Error Boundary
    </button>
  );
}

export default ErrorTestButton;
