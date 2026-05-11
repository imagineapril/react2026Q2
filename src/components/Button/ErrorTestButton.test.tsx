import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorTestButton from './ErrorTestButton';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

describe('ErrorTestButton', () => {
  it('renders button with correct text', () => {
    render(<ErrorTestButton />);
    expect(screen.getByText('Test Error Boundary')).toBeInTheDocument();
  });

  it('throws error when clicked', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<ErrorTestButton />);
    const button = screen.getByText('Test Error Boundary');
    expect(() => {
      fireEvent.click(button);
    }).toThrow('Test error');
    spy.mockRestore();
  });

  it('triggers error boundary fallback when wrapped', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ErrorTestButton />
      </ErrorBoundary>
    );
    const button = screen.getByText('Test Error Boundary');
    fireEvent.click(button);
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    spy.mockRestore();
  });
});