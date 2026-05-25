import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePokemonStore } from './pokemonStore';
import { apiService } from '../services/api';

vi.mock('../services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
  },
}));

describe('pokemonStore', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      items: [],
      allItems: [],
      searchTerm: '',
      loading: false,
      error: null,
      selectedIds: new Set(),
    });
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('fetchAllItems loads data into allItems and items', async () => {
    const mockItems = [{ id: 1, name: 'Bulbasaur', description: '', image: '', height: 0, weight: 0, types: [] }];
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockItems);
    const { fetchAllItems } = usePokemonStore.getState();
    await fetchAllItems();
    const state = usePokemonStore.getState();
    expect(state.allItems).toEqual(mockItems);
    expect(state.items).toEqual(mockItems);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('fetchAllItems handles error', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('Network error'));
    const { fetchAllItems } = usePokemonStore.getState();
    await fetchAllItems();
    const state = usePokemonStore.getState();
    expect(state.error).toBe('Failed to load items');
    expect(state.loading).toBe(false);
  });

  it('searchItems updates items and saves searchTerm to localStorage', async () => {
    const mockResults = [{ id: 2, name: 'Charmander', description: '', image: '', height: 0, weight: 0, types: [] }];
    vi.mocked(apiService.searchItems).mockResolvedValue(mockResults);
    const { searchItems } = usePokemonStore.getState();
    await searchItems('charmander');
    const state = usePokemonStore.getState();
    expect(state.items).toEqual(mockResults);
    expect(state.searchTerm).toBe('charmander');
    expect(localStorage.setItem).toHaveBeenCalledWith('pokemonSearchTerm', JSON.stringify('charmander'));
  });

  it('searchItems handles error', async () => {
    vi.mocked(apiService.searchItems).mockRejectedValue(new Error('Search failed'));
    const { searchItems } = usePokemonStore.getState();
    await searchItems('test');
    const state = usePokemonStore.getState();
    expect(state.error).toBe('Failed to search items');
    expect(state.loading).toBe(false);
  });

  it('setSearchTerm calls searchItems', async () => {
    const searchItemsSpy = vi.spyOn(usePokemonStore.getState(), 'searchItems');
    const { setSearchTerm } = usePokemonStore.getState();
    await setSearchTerm('pikachu');
    expect(searchItemsSpy).toHaveBeenCalledWith('pikachu');
  });

  it('toggleSelected adds and removes ids', () => {
    const { toggleSelected } = usePokemonStore.getState();
    expect(usePokemonStore.getState().selectedIds.has(1)).toBe(false);
    toggleSelected(1);
    expect(usePokemonStore.getState().selectedIds.has(1)).toBe(true);
    toggleSelected(1);
    expect(usePokemonStore.getState().selectedIds.has(1)).toBe(false);
  });

  it('clearSelected removes all ids', () => {
    const { toggleSelected, clearSelected } = usePokemonStore.getState();
    toggleSelected(1);
    toggleSelected(2);
    expect(usePokemonStore.getState().selectedIds.size).toBe(2);
    clearSelected();
    expect(usePokemonStore.getState().selectedIds.size).toBe(0);
  });

  it('isSelected returns correct boolean', () => {
    const { toggleSelected, isSelected } = usePokemonStore.getState();
    expect(isSelected(1)).toBe(false);
    toggleSelected(1);
    expect(isSelected(1)).toBe(true);
  });
});