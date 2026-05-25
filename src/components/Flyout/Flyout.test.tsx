import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Flyout from './Flyout';
import { usePokemonStore } from '../../store/pokemonStore';

describe('Flyout', () => {
  beforeEach(() => {
    usePokemonStore.setState({
      selectedIds: new Set(),
      allItems: [],
      clearSelected: vi.fn(),
    });
  });

  it('renders null when no items selected', () => {
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('renders flyout when items selected', () => {
    usePokemonStore.setState({
      selectedIds: new Set([1, 2]),
      allItems: [],
    });
    render(<Flyout />);
    expect(screen.getByText('Selected: 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Unselect All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Download CSV' })).toBeInTheDocument();
  });

  it('calls clearSelected when Unselect All clicked', () => {
    const clearSelectedMock = vi.fn();
    usePokemonStore.setState({
      selectedIds: new Set([1]),
      allItems: [],
      clearSelected: clearSelectedMock,
    });
    render(<Flyout />);
    fireEvent.click(screen.getByText('Unselect All'));
    expect(clearSelectedMock).toHaveBeenCalledTimes(1);
  });

  it('downloads CSV with correct data', async () => {
    const mockAllItems = [
      { id: 1, name: 'Bulbasaur', description: 'Seed', height: 7, weight: 69, types: ['grass', 'poison'] },
      { id: 2, name: 'Charmander', description: 'Lizard', height: 6, weight: 85, types: ['fire'] },
    ];
    usePokemonStore.setState({
      selectedIds: new Set([1, 2]),
      allItems: mockAllItems,
      clearSelected: vi.fn(),
    });

    const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
    const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

    render(<Flyout />);
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
      allItems: [{ id: 1, name: 'Bulbasaur', description: '', height: 0, weight: 0, types: [] }],
      clearSelected: vi.fn(),
    });
    render(<Flyout />);
    fireEvent.click(screen.getByText('Download CSV'));
    expect(createObjectURLSpy).not.toHaveBeenCalled();
    createObjectURLSpy.mockRestore();
  });
});