import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ThemeProvider } from './ThemeProvider';
import { useTheme } from './ThemeContext';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
  localStorage.clear();
});

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span>Theme: {theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
};

describe('ThemeContext', () => {
  it('provides initial theme from localStorage or system', () => {
    localStorage.setItem('theme', 'dark');
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    expect(screen.getByText('Theme: dark')).toBeInTheDocument();
  });

  it('toggles theme when button clicked', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const button = screen.getByText('Toggle');
    const themeSpan = screen.getByText(/Theme:/);
    const initialTheme = themeSpan.textContent?.split(': ')[1];
    fireEvent.click(button);
    const newTheme = themeSpan.textContent?.split(': ')[1];
    expect(newTheme).not.toBe(initialTheme);
  });
});