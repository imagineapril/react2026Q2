import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flyout from './Flyout';
import { usePokemonStore } from '../../store/pokemonStore';
import { usePokemonList } from '../../hooks/usePokemonQueries';
import { mockUseQueryResult } from '../../test/test-utils';
import type { Item, PokemonPageResult } from '../../types';

vi.mock('../../hooks/usePokemonQueries', () => ({
  usePokemonList: vi.fn(),
  pokemonKeys: { lists: () => ['pokemon', 'list'] },
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const renderWithQueryClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

describe('Flyout', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      selectedIds: new Set(),
      clearSelected: vi.fn(),
    });

    vi.mocked(usePokemonList).mockReturnValue(mockUseQueryResult({ items: [], total: 0 }));
  });

  it('renders null when no items selected', () => {
    const { container } = renderWithQueryClient(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders flyout when items selected', () => {
    usePokemonStore.setState({
      selectedIds: new Set([1, 2]),
    });
    const mockItems: Item[] = [
      { id: 1, name: 'Bulbasaur', description: '', height: 0, weight: 0, types: [] },
      { id: 2, name: 'Charmander', description: '', height: 0, weight: 0, types: [] },
    ];
    vi.mocked(usePokemonList).mockReturnValue(
      mockUseQueryResult<PokemonPageResult>({ items: mockItems, total: 2 })
    );
    renderWithQueryClient(<Flyout />);

    expect(screen.getByText('Selected: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unselect All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download CSV' })).toBeInTheDocument();
  });

  it('calls clearSelected when Unselect All clicked', () => {
    const clearSelectedMock = vi.fn();
    usePokemonStore.setState({
      selectedIds: new Set([1]),
      clearSelected: clearSelectedMock,
    });
    const mockItems: Item[] = [{ id: 1, name: 'Bulbasaur', description: '', height: 0, weight: 0, types: [] }];
    vi.mocked(usePokemonList).mockReturnValue(
      mockUseQueryResult<PokemonPageResult>({ items: mockItems, total: 1 })
    );
    renderWithQueryClient(<Flyout />);
    fireEvent.click(screen.getByText('Unselect All'));
    expect(clearSelectedMock).toHaveBeenCalledTimes(1);
  });

  it('downloads CSV with correct data', async () => {
    const mockItems: Item[] = [
      { id: 1, name: 'Bulbasaur', description: 'Seed', height: 7, weight: 69, types: ['grass', 'poison'] },
      { id: 2, name: 'Charmander', description: 'Lizard', height: 6, weight: 85, types: ['fire'] },
    ];
    usePokemonStore.setState({
      selectedIds: new Set([1, 2]),
      clearSelected: vi.fn(),
    });
    vi.mocked(usePokemonList).mockReturnValue(
      mockUseQueryResult<PokemonPageResult>({ items: mockItems, total: 2 })
    );

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:url');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    renderWithQueryClient(<Flyout />);
    fireEvent.click(screen.getByText('Download CSV'));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    const blob = createObjectURLSpy.mock.calls[0][0];
    expect(blob).toBeInstanceOf(Blob);
    const csvText = await (blob as Blob).text();
    expect(csvText).toContain('Name,Description,Height,Weight,Types');
    expect(csvText).toContain('Bulbasaur,Seed,7,69,grass, poison');
    expect(csvText).toContain('Charmander,Lizard,6,85,fire');
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);

    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
  });

  it('does nothing if selectedIds are not in allItems', () => {
    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
    usePokemonStore.setState({
      selectedIds: new Set([999]),
      clearSelected: vi.fn(),
    });
    const mockItems: Item[] = [{ id: 1, name: 'Bulbasaur', description: '', height: 0, weight: 0, types: [] }];
    vi.mocked(usePokemonList).mockReturnValue(
      mockUseQueryResult<PokemonPageResult>({ items: mockItems, total: 1 })
    );
    renderWithQueryClient(<Flyout />);
    fireEvent.click(screen.getByText('Download CSV'));
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    createObjectURLSpy.mockRestore();
  });
});