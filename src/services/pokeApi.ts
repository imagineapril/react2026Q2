import type { Item, ApiPokemonListItem, ApiPokemonDetail, ApiPokemonSpecies, PokemonPageResult } from '../types';

const BASE_URL = 'https://pokeapi.co/api/v2';
const ITEMS_PER_PAGE = 20;


export async function fetchPokemonList(limit = 151, offset = 0): Promise<ApiPokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch pokemon list');
  const data = await response.json();
  return data.results;
}

export async function fetchPokemonDetail(idOrName: string | number): Promise<ApiPokemonDetail> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  if (!response.ok) throw new Error(`Failed to fetch pokemon detail for ${idOrName}`);
  return response.json();
}

export async function fetchPokemonSpecies(idOrName: string | number): Promise<ApiPokemonSpecies> {
  const response = await fetch(`${BASE_URL}/pokemon-species/${idOrName}`);
  if (!response.ok) throw new Error(`Failed to fetch pokemon species for ${idOrName}`);
  return response.json();
}

export async function fetchFullPokemonItem(idOrName: string | number): Promise<Item> {
  const [detail, species] = await Promise.all([
    fetchPokemonDetail(idOrName),
    fetchPokemonSpecies(idOrName),
  ]);

  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === 'en'
  );
  const description = englishEntry
    ? englishEntry.flavor_text.replace(/\f|\n/g, ' ').trim()
    : 'No description available.';

  return {
    id: detail.id,
    name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
    description,
    image: detail.sprites.other['official-artwork'].front_default,
    height: detail.height,
    weight: detail.weight,
    types: detail.types.map(t => t.type.name),
  };
}

export async function fetchAllPokemonItems(limit = 151): Promise<Item[]> {
  const list = await fetchPokemonList(limit, 0);
  const batchSize = 20;
  const items: Item[] = [];
  for (let i = 0; i < list.length; i += batchSize) {
    const batch = list.slice(i, i + batchSize);
    const batchItems = await Promise.all(
      batch.map(p => fetchFullPokemonItem(p.name))
    );
    items.push(...batchItems);
  }
  return items;
}

let cachedAllItems: Item[] | null = null;

export async function searchPokemon(term: string, page: number, limit: number = ITEMS_PER_PAGE): Promise<PokemonPageResult> {
  if (!cachedAllItems) {
    cachedAllItems = await fetchAllPokemonItems(151);
  }
  const filtered = term.trim()
    ? cachedAllItems.filter(item => item.name.toLowerCase().includes(term.toLowerCase()))
    : cachedAllItems;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);
  return { items, total };
}

export async function fetchTotalCount(): Promise<number> {
  const response = await fetch(`${BASE_URL}/pokemon?limit=0`);
  const data = await response.json();
  return data.count;
}

export async function fetchPokemonPageItems(page: number, itemsPerPage: number): Promise<{ items: Item[]; total: number }> {
  const offset = (page - 1) * itemsPerPage;
  const list = await fetchPokemonList(itemsPerPage, offset);
  const items = await Promise.all(
    list.map(p => fetchFullPokemonItem(p.name))
  );
  const total = await fetchTotalCount();
  return { items, total };
}

export async function fetchPokemonPage(page: number, limit: number = ITEMS_PER_PAGE): Promise<PokemonPageResult> {
  const offset = (page - 1) * limit;
  const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!response.ok) throw new Error('Failed to fetch pokemon list');
  const data = await response.json();
  const total = data.count;
  const list: ApiPokemonListItem[] = data.results;
  const items = await Promise.all(list.map(p => fetchFullPokemonItem(p.name)));
  return { items, total };
}

export async function getPokemonData(
  searchTerm: string,
  page: number,
  limit: number = ITEMS_PER_PAGE
): Promise<PokemonPageResult> {
  if (searchTerm) {
    return searchPokemon(searchTerm, page, limit);
  }
  return fetchPokemonPage(page, limit);
}