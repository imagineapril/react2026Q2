import { render, screen } from '@testing-library/react';
import Main from './Main';

describe('Main', () => {
  it('renders children', () => {
    render(
      <Main>
        <div>Test Child</div>
      </Main>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});