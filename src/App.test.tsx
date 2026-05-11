import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import { apiService } from './services/api';
import type { Item } from './types';

vi.mock('./services/api', () => ({
  apiService: {
    getAllItems: vi.fn(),
    searchItems: vi.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loader while fetching data', () => {
    vi.mocked(apiService.getAllItems).mockImplementation(() => new Promise(() => {}));
    render(<App />);
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('displays pokemon list after successful fetch', async () => {
    const mockItems: Item[] = [
      { id: 1, name: 'Bulbasaur', description: 'Grass type', image: '', height: 0, weight: 0, types: [] },
      { id: 2, name: 'Charmander', description: 'Fire type', image: '', height: 0, weight: 0, types: [] },
    ];
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockItems);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    vi.mocked(apiService.getAllItems).mockRejectedValue(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load items/i)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading Pokémon...')).not.toBeInTheDocument();
  });

  it('performs search when search term changes', async () => {
    const mockAllItems: Item[] = [
      { id: 1, name: 'Bulbasaur', description: 'Grass', image: '', height: 0, weight: 0, types: [] },
      { id: 2, name: 'Charmander', description: 'Fire', image: '', height: 0, weight: 0, types: [] },
    ];
    const mockFiltered: Item[] = [
      { id: 1, name: 'Bulbasaur', description: 'Grass', image: '', height: 0, weight: 0, types: [] },
    ];
    vi.mocked(apiService.getAllItems).mockResolvedValue(mockAllItems);
    vi.mocked(apiService.searchItems).mockResolvedValue(mockFiltered);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'bulba' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.queryByText('Charmander')).not.toBeInTheDocument();
    });
    expect(apiService.searchItems).toHaveBeenCalledWith('bulba');
  });
});