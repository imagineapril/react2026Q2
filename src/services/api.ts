import type { Item, PokemonListResponse, PokemonDetail } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';

let allPokemonCache: Item[] | null = null;

const fetchPokemonDetails = async (url: string): Promise<Item> => {
  const response = await fetch(url);
  const data: PokemonDetail = await response.json();
  
  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    description: getPokemonDescription(data),
    image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
    height: data.height,
    weight: data.weight,
    types: data.types.map(t => t.type.name),
  };
};

const getPokemonDescription = (data: PokemonDetail): string => {
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);
  const types = data.types.map(t => t.type.name).join('/');
  
  return `Height: ${heightM}m | Weight: ${weightKg}kg | Type: ${types}`;
};

export const apiService = {
  getAllItems: async (): Promise<Item[]> => {
    try {
      if (allPokemonCache) {
        return allPokemonCache;
      }

      const response = await fetch(`${BASE_URL}/pokemon?limit=151&offset=0`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: PokemonListResponse = await response.json();
      
      const items: Item[] = await Promise.all(
        data.results.map(async (pokemon) => {
          return await fetchPokemonDetails(pokemon.url);
        })
      );
      
      allPokemonCache = items;
      
      return items;
    } catch (error) {
      console.error('Failed to fetch data:', error);
      return [];
    }
  },

  searchItems: async (searchTerm: string): Promise<Item[]> => {

    if (!searchTerm.trim()) {
      return apiService.getAllItems();
    }

    const allItems = await apiService.getAllItems();

    const filtered = allItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  },
};