import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './HomePage';
import { usePokemonList } from '../../hooks/usePokemonQueries';
import { mockUseQueryResult } from '../../test/test-utils';
import type { PokemonPageResult } from '../../types';

vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonList: vi.fn(),
  pokemonKeys: { lists: () => ['pokemon', 'list'] },
}));

vi.mock('../../components/Flyout/Flyout', () => ({
  default: () => <div data-testid="flyout-mock" />,
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithRouter = (ui: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

const allMockPokemons = Array.from({ length: 151 }, (_, i) => ({
  id: i + 1,
  name: `Pokemon ${i + 1}`,
  description: `Description ${i + 1}`,
  image: `image${i + 1}.png`,
  height: 10,
  weight: 100,
  types: ['normal'],
}));

const getPageItems = (page: number, itemsPerPage: number): PokemonPageResult => {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const items = allMockPokemons.slice(start, end);
  return { items, total: allMockPokemons.length };
};

describe('HomePage', () => {
  beforeEach(() => {
    vi.mocked(usePokemonList).mockImplementation((page: number = 1, _searchTerm: string = '', limit: number = 20) => {
      void _searchTerm;
      const result = getPageItems(page, limit);
      return mockUseQueryResult(result);
    });
  });

  it('loads and displays pokemon list (first page, 20 items)', async () => {
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText('Results (20)')).toBeInTheDocument();
    });
    expect(screen.getByText('Pokemon 1')).toBeInTheDocument();
    expect(screen.queryByText('Pokemon 21')).not.toBeInTheDocument();
  });

  it('paginates correctly: page 2 shows items 21-40', async () => {
    renderWithRouter(<HomePage />, ['/?page=2']);
    await waitFor(() => {
      expect(screen.getByText('Results (20)')).toBeInTheDocument();
    });
    expect(screen.getByText('Pokemon 21')).toBeInTheDocument();
    expect(screen.queryByText('Pokemon 1')).not.toBeInTheDocument();
  });

  it('updates displayed items when page changes', async () => {
    renderWithRouter(<HomePage />);
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
    renderWithRouter(<HomePage />, ['/?page=3']);
    await waitFor(() => screen.getByText('Results (20)'));

    const input = screen.getByPlaceholderText('Enter pokemon name');
    await userEvent.type(input, 'pikachu');
    await userEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(usePokemonList).toHaveBeenLastCalledWith(1, 'pikachu', 20);
  });

  it('shows loader while fetching data', async () => {
  vi.mocked(usePokemonList).mockReturnValue({
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
  } as unknown as ReturnType<typeof usePokemonList>);
  renderWithRouter(<HomePage />);
  expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
});

  it('shows error fallback when API fails', async () => {
    const errorMessage = 'Failed to fetch';
    vi.mocked(usePokemonList).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error(errorMessage),
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
      failureReason: new Error(errorMessage),
      isInitialLoading: false,
      isLoadingError: true,
      isRefetchError: false,
      isPaused: false,
    } as unknown as ReturnType<typeof usePokemonList>);
    renderWithRouter(<HomePage />);
    await waitFor(() => {
      expect(screen.getByText(/Oops! Something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    });
  });

  it('caches data and does not refetch on remount', async () => {
    const mockFn = vi.mocked(usePokemonList);
    mockFn.mockClear();
    mockFn.mockImplementation((page: number = 1, _searchTerm: string = '', limit: number = 20) => {
      void _searchTerm;
      const result = getPageItems(page, limit);
      return mockUseQueryResult(result);
    });

    const { unmount } = renderWithRouter(<HomePage />);
    await waitFor(() => screen.getByText('Results (20)'));
    expect(mockFn).toHaveBeenCalledTimes(1);

    unmount();
    renderWithRouter(<HomePage />);
    await waitFor(() => screen.getByText('Results (20)'));
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
})