import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RootLayout from './RootLayout';

describe('RootLayout', () => {
  it('renders header and navigation', () => {
    render(
      <MemoryRouter>
        <RootLayout />
      </MemoryRouter>
    );
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });
});