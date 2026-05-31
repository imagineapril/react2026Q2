import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider, type UseQueryResult } from '@tanstack/react-query';
import PokemonDetailPage from './PokemonDetailPage';
import { usePokemonDetail } from '../../hooks/usePokemonQueries';
import { mockUseQueryResult } from '../../test/test-utils';
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
    vi.mocked(usePokemonDetail).mockReturnValue(
      mockUseQueryResult(mockPokemon, false, null)
    );

    renderWithRouter('/pokemon/25');
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
    expect(screen.getByText('Electric mouse')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    const loadingResult = {
      data: undefined,
      isLoading: true,
      error: null,
      isError: false,
      isPending: true,
      isSuccess: false,
      status: 'pending',
      fetchStatus: 'idle',
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      promise: Promise.resolve(undefined),
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      errorUpdateCount: 0,
      failureCount: 0,
      failureReason: null,
      isInitialLoading: true,
      isLoadingError: false,
      isRefetchError: false,
      isPaused: false,
    } as unknown as UseQueryResult<Item>;
    
    vi.mocked(usePokemonDetail).mockReturnValue(loadingResult);
    renderWithRouter('/pokemon/25');
    expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
  });


  it('shows error if pokemon not found', async () => {
    const errorResult = {
      data: undefined,
      isLoading: false,
      error: new Error('Not found'),
      isError: true,
      isPending: false,
      isSuccess: false,
      status: 'error',
      fetchStatus: 'idle',
      isFetched: true,
      isFetchedAfterMount: true,
      isFetching: false,
      isPlaceholderData: false,
      isRefetching: false,
      isStale: false,
      refetch: vi.fn(),
      promise: Promise.resolve(undefined),
      dataUpdatedAt: 0,
      errorUpdatedAt: Date.now(),
      errorUpdateCount: 1,
      failureCount: 1,
      failureReason: new Error('Not found'),
      isInitialLoading: false,
      isLoadingError: true,
      isRefetchError: false,
      isPaused: false,
    } as unknown as UseQueryResult<Item>;
    
    vi.mocked(usePokemonDetail).mockReturnValue(errorResult);
    renderWithRouter('/pokemon/999');
    await waitFor(() => {
      expect(screen.getByText(/Error: Not found/i)).toBeInTheDocument();
    });
  });
});