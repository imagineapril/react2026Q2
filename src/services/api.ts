// import type { Item, PokemonListResponse, PokemonDetail } from '../types';

// const BASE_URL = 'https://pokeapi.co/api/v2';

// let allPokemonCache: Item[] | null = null;

// const fetchPokemonDetails = async (url: string): Promise<Item> => {
//   const response = await fetch(url);
//   const data: PokemonDetail = await response.json();
  
//   return {
//     id: data.id,
//     name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
//     description: getPokemonDescription(data),
//     image: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
//     height: data.height,
//     weight: data.weight,
//     types: data.types.map(t => t.type.name),
//   };
// };

// const getPokemonDescription = (data: PokemonDetail): string => {
//   const heightM = (data.height / 10).toFixed(1);
//   const weightKg = (data.weight / 10).toFixed(1);
//   const types = data.types.map(t => t.type.name).join('/');
  
//   return `Height: ${heightM}m | Weight: ${weightKg}kg | Type: ${types}`;
// };

// export const apiService = {
//   getAllItems: async (): Promise<Item[]> => {
//     if (allPokemonCache) {
//       return allPokemonCache;
//     }

//     try {
//       const response = await fetch(`${BASE_URL}/pokemon?limit=20&offset=0`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`);
//       }
      
//       const data: PokemonListResponse = await response.json();
      
//       const items: Item[] = [];
//       for (let i = 0; i < data.results.length; i++) {
//         const pokemon = data.results[i];
//         try {
//           const item = await fetchPokemonDetails(pokemon.url);
//           items.push(item);
//           await new Promise(resolve => setTimeout(resolve, 100));
//         } catch (error) {
//           console.error(`❌ Ошибка при загрузке ${pokemon.name}:`, error);
//           items.push({
//             id: i + 1,
//             name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
//             description: 'Failed to load details',
//             types: ['normal'],
//           });
//         }
//       }
      
//       allPokemonCache = items;
//       return items;
//     } catch (error) {
//       console.error('❌ Ошибка API:', error);
//       throw error;
//     }
//   },

//   searchItems: async (searchTerm: string): Promise<Item[]> => {
//     console.log('🔍 Поиск:', searchTerm);
    
//     if (!searchTerm.trim()) {
//       return apiService.getAllItems();
//     }

//     const allItems = await apiService.getAllItems();

//     const filtered = allItems.filter(item =>
//       item.name.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return filtered;
//   },
// };

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