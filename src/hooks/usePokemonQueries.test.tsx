import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode } from 'react';
import { usePokemonList } from './usePokemonQueries';
import * as pokeApi from '../services/pokeApi';

vi.mock('../services/pokeApi');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

test('usePokemonList fetches data without search term', async () => {
  const mockData = { items: [], total: 0 };
  const fetchSpy = vi.spyOn(pokeApi, 'fetchPokemonPage').mockResolvedValue(mockData);

  const { result } = renderHook(() => usePokemonList(1, '', 20), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(mockData);
  expect(fetchSpy).toHaveBeenCalledWith(1, 20);
});

test('usePokemonList fetches search results when searchTerm provided', async () => {
  const mockData = { items: [], total: 0 };
  const searchSpy = vi.spyOn(pokeApi, 'searchPokemon').mockResolvedValue(mockData);

  const { result } = renderHook(() => usePokemonList(1, 'pikachu', 20), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data).toEqual(mockData);
  expect(searchSpy).toHaveBeenCalledWith('pikachu', 1, 20);
});