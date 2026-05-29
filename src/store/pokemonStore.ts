import { create } from 'zustand';
import type { PokemonStoreState } from '../types';

export const usePokemonStore = create<PokemonStoreState>((set, get) => ({
  selectedIds: new Set<number>(),
  toggleSelected: (id) => {
    const { selectedIds } = get();
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    set({ selectedIds: newSet });
  },
  clearSelected: () => set({ selectedIds: new Set() }),
  isSelected: (id) => get().selectedIds.has(id),
}));