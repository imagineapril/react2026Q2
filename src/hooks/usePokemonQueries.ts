import { useQuery } from '@tanstack/react-query';
import { searchPokemon, fetchFullPokemonItem, fetchPokemonPage } from '../services/pokeApi';
import type { PokemonPageResult } from '../types';

export const pokemonKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonKeys.all, 'list'] as const,
  list: (filters: { search?: string; page?: number; limit?: number}) => [...pokemonKeys.lists(), filters] as const,
  details: () => [...pokemonKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...pokemonKeys.details(), id] as const,
};

export function usePokemonList(page: number = 1, searchTerm: string = '', limit: number = 20) {
  return useQuery<PokemonPageResult>({
    queryKey: pokemonKeys.list({ search: searchTerm, page, limit }),
    queryFn: () => (searchTerm ? searchPokemon(searchTerm, page, limit) : fetchPokemonPage(page, limit)),
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