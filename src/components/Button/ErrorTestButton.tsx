import { Component } from 'react';
import styles from './Button.module.css';
import type { ErrorTestButtonProps, ErrorTestButtonState } from '../../types';


class ErrorTestButton extends Component<ErrorTestButtonProps, ErrorTestButtonState> {
  constructor(props: ErrorTestButtonProps) {
    super(props);
    this.state = {
      shouldThrow: false,
    };
  }

  handleThrowError = () => {
    this.setState({ shouldThrow: true }, () => {
      throw new Error('Test error triggered by user! This is a simulated error for testing Error Boundary.');
    });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Test error');
    }

    return (
      <button className={styles.button} onClick={this.handleThrowError}>
        Test Error Boundary
      </button>
    );
  }
}

export default ErrorTestButton;