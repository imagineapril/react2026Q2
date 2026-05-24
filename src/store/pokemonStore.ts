import { create } from 'zustand';
import { apiService } from '../services/api';
import type { PokemonStoreState } from '../types';

export const usePokemonStore = create<PokemonStoreState>((set, get) => ({
  items: [],
  searchTerm: '',
  loading: false,
  error: null,

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
    if (term === get().searchTerm) return;
    get().searchItems(term);
  },

  clearError: () => set({ error: null }),
}));