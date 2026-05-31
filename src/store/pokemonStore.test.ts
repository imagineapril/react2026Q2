import { renderHook, act } from '@testing-library/react';
import { usePokemonStore } from './pokemonStore';

describe('pokemonStore', () => {
  it('initializes with empty selectedIds', () => {
    const { result } = renderHook(() => usePokemonStore());
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('toggleSelected adds id when not present', () => {
    const { result } = renderHook(() => usePokemonStore());
    act(() => {
      result.current.toggleSelected(1);
    });
    expect(result.current.selectedIds.has(1)).toBe(true);
    expect(result.current.selectedIds.size).toBe(1);
  });

  it('clearSelected removes all ids', () => {
    const { result } = renderHook(() => usePokemonStore());
    act(() => {
      result.current.toggleSelected(1);
      result.current.toggleSelected(2);
      result.current.clearSelected();
    });
    expect(result.current.selectedIds.size).toBe(0);
  });

  it('isSelected returns correct boolean', () => {
    const { result } = renderHook(() => usePokemonStore());
    act(() => {
      result.current.toggleSelected(1);
    });
    expect(result.current.isSelected(1)).toBe(true);
    expect(result.current.isSelected(2)).toBe(false);
  });
});