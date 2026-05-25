import { create } from 'zustand';
import { apiService } from '../services/api';
import type { PokemonStoreState } from '../types';

const STORAGE_KEY = 'pokemonSearchTerm';

const getInitialSearchTerm = (): string => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : '';
  } catch {
    return '';
  }
};

export const usePokemonStore = create<PokemonStoreState>((set, get) => ({
  items: [],
  searchTerm: getInitialSearchTerm(),
  loading: false,
  error: null,
  selectedIds: new Set<number>(),

  fetchAllItems: async () => {
    set({ loading: true, error: null });
    try {
      const allItems = await apiService.getAllItems();
      set({ items: allItems, loading: false });
    } catch (err) {
      set({ error: 'Failed to load items', loading: false });
      console.error(err);
    }
  },

  searchItems: async (term: string) => {

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(term));
    } catch (error) {
      console.error('Failed to save searchTerm to localStorage', error);
    }

    set({ loading: true, error: null, searchTerm: term });
    try {
      const results = await apiService.searchItems(term);
      set({ items: results, loading: false });
    } catch (err) {
      set({ error: 'Failed to search items', loading: false });
      console.error(err);
    }
  },

  setSearchTerm: (term: string) => {
    get().searchItems(term);
  },

  clearError: () => set({ error: null }),

  toggleSelected: (id: number) => {
    const { selectedIds } = get();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    set({ selectedIds: newSet });
  },

  clearSelected: () => {
    set({ selectedIds: new Set<number>() });
  },

  isSelected: (id: number) => {
    return get().selectedIds.has(id);
  },
}));