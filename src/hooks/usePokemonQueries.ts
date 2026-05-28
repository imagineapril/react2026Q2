import { useQuery } from '@tanstack/react-query';
import { fetchAllPokemonItems, searchPokemon, fetchFullPokemonItem } from '../services/pokeApi';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (filters: { search?: string }) => [...pokemonKeys.lists(), filters] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...pokemonKeys.details(), id] as const,
};

export function usePokemonList(searchTerm: string = '') {
  return useQuery({
    queryKey: pokemonKeys.list({ search: searchTerm }),
    queryFn: () => (searchTerm ? searchPokemon(searchTerm) : fetchAllPokemonItems(151)),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePokemonDetail(id: number | string | undefined) {
  return useQuery({
    queryKey: pokemonKeys.detail(id as string),
    queryFn: () => fetchFullPokemonItem(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}