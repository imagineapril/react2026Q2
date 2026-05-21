import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import { apiService } from '../../services/api';
import { mockPokemonList } from '../../mockData';

vi.mock('../../services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockPokemonList);
    vi.mocked(apiService.searchItems).mockResolvedValue([]);
  });

  it('loads and displays pokemon list', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <HomePage />
      </MemoryRouter>
    );
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Results (20)')).toBeInTheDocument();
    });
    expect(screen.getByText('Pokemon 1')).toBeInTheDocument();
  });

  it('paginates correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=2']}>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Results (20)')).toBeInTheDocument();
    });
    expect(screen.getByText('Pokemon 21')).toBeInTheDocument();
    expect(screen.queryByText('Pokemon 1')).not.toBeInTheDocument();
  });

  it('updates displayed items when page changes', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=1']}>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Results (20)'));
    expect(screen.getByText('Pokemon 1')).toBeInTheDocument();

    const nextButton = screen.getByText('Next');
    await userEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Pokemon 21')).toBeInTheDocument();
      expect(screen.queryByText('Pokemon 1')).not.toBeInTheDocument();
    });
  });

  it('resets page to 1 on search', async () => {
    render(
      <MemoryRouter initialEntries={['/?page=3']}>
        <HomePage />
      </MemoryRouter>
    );
    await waitFor(() => screen.getByText('Results (20)'));
    const input = screen.getByPlaceholderText('Enter pokemon name');
    await userEvent.type(input, 'pikachu');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));
    await waitFor(() => {
      expect(screen.getByText('Results (0)')).toBeInTheDocument();
    });
  });
});