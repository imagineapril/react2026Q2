import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { usePokemonList, usePokemonDetail } from './usePokemonQueries';
import * as pokeApi from '../services/pokeApi';

vi.mock('../services/pokeApi');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('usePokemonList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data without search term', async () => {
    const mockData = { items: [], total: 0 };
    const fetchSpy = vi.spyOn(pokeApi, 'fetchPokemonPage').mockResolvedValue(mockData);

    const { result } = renderHook(() => usePokemonList(1, '', 20), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(fetchSpy).toHaveBeenCalledWith(1, 20);
  });

  it('fetches search results when searchTerm provided', async () => {
    const mockData = { items: [], total: 0 };
    const searchSpy = vi.spyOn(pokeApi, 'searchPokemon').mockResolvedValue(mockData);

    const { result } = renderHook(() => usePokemonList(1, 'pikachu', 20), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
    expect(searchSpy).toHaveBeenCalledWith('pikachu', 1, 20);
  });
});

describe('usePokemonDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches pokemon detail when id is provided', async () => {
    const mockPokemon = {
      id: 25,
      name: 'Pikachu',
      description: 'Electric',
      image: 'pika.png',
      height: 4,
      weight: 60,
      types: ['electric'],
    };
    const fetchSpy = vi.spyOn(pokeApi, 'fetchFullPokemonItem').mockResolvedValue(mockPokemon);

    const { result } = renderHook(() => usePokemonDetail('25'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPokemon);
    expect(fetchSpy).toHaveBeenCalledWith('25');
  });

  it('does not fetch when id is undefined', () => {
    const fetchSpy = vi.spyOn(pokeApi, 'fetchFullPokemonItem');
    renderHook(() => usePokemonDetail(undefined), { wrapper });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});