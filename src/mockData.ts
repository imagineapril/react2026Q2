import type { Item } from './types';

export const mockPokemonList: Item[] = Array.from({ length: 151 }, (_, i) => ({
  id: i + 1,
  name: `Pokemon ${i + 1}`,
  description: `Height: ${(Math.random() * 2 + 0.2).toFixed(1)}m | Weight: ${(Math.random() * 100 + 5).toFixed(1)}kg | Type: ${['grass', 'fire', 'water', 'electric'][Math.floor(Math.random() * 4)]}`,
  image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i + 1}.png`,
  height: Math.floor(Math.random() * 20) + 2,
  weight: Math.floor(Math.random() * 200) + 20,
  types: [['grass', 'poison'], ['fire'], ['water'], ['electric']][Math.floor(Math.random() * 4)],
}));