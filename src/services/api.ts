import type { Item } from '../types';
import { mockPokemonList } from '../mockData';

let allPokemonCache: Item[] | null = null;

export const apiService = {
  getAllItems: async (): Promise<Item[]> => {
    if (allPokemonCache) {
      return allPokemonCache;
    }
    console.log('🔄 Загружаем моковые данные...');
    await new Promise(resolve => setTimeout(resolve, 800));
    allPokemonCache = mockPokemonList;
    return allPokemonCache;
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
