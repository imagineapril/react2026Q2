import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RootLayout from './RootLayout';
import { ThemeProvider } from '../../context/ThemeProvider';

describe('RootLayout', () => {
  it('renders header and navigation', () => {
    render(
      <ThemeProvider>
        <MemoryRouter>
          <RootLayout />
        </MemoryRouter>
      </ThemeProvider>
    );
    expect(screen.getByText(/Pokemon Search App/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Light|Dark/i })).toBeInTheDocument();
  });
});