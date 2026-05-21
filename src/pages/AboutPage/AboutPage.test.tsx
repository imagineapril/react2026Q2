import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

test('AboutPage renders author and link', () => {
  render(<MemoryRouter><AboutPage /></MemoryRouter>);
  expect(screen.getByText(/Author/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /RS School React Course/i })).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
});