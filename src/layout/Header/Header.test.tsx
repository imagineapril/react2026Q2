import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it('renders header title', () => {
    render(<Header />);
    expect(screen.getByText('Pokemon Search App')).toBeInTheDocument();
  });
});