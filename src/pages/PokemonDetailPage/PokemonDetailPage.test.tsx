import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider,type UseQueryResult} from '@tanstack/react-query';
import PokemonDetailPage from './PokemonDetailPage';
import { usePokemonDetail } from '../../hooks/usePokemonQueries';
import type { Item } from '../../types';

vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonDetail: vi.fn(),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithRouter = (initialEntry: string) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('PokemonDetailPage', () => {
  it('shows loader then details', async () => {
    const mockPokemon: Item = {
      id: 25,
      name: 'Pikachu',
      description: 'Electric mouse',
      image: 'pikachu.png',
      height: 4,
      weight: 60,
      types: ['Electric'],
    };
    vi.mocked(usePokemonDetail).mockReturnValue({
      data: mockPokemon,
      isLoading: false,
      error: null,
    } as unknown as UseQueryResult<Item>);

    renderWithRouter('/pokemon/25');
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
    expect(screen.getByText('Electric mouse')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(usePokemonDetail).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as unknown as UseQueryResult<Item>);
    renderWithRouter('/pokemon/25');
    expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
  });

  it('shows error if pokemon not found', async () => {
    vi.mocked(usePokemonDetail).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Not found'),
    } as unknown as UseQueryResult<Item>);
    renderWithRouter('/pokemon/999');
    await waitFor(() => {
      expect(screen.getByText(/Error: Not found/i)).toBeInTheDocument();
    });
  });
});