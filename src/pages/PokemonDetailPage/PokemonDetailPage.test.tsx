import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PokemonDetailPage from './PokemonDetailPage';
import { apiService } from '../../services/api';

vi.mock('../../services/api', () => ({
  getItemById: vi.fn(),
  apiService: { getAllItems: vi.fn() },
}));

describe('PokemonDetailPage', () => {
  it('shows loader then details', async () => {
    const mockPokemon = {
      id: 25,
      name: 'Pikachu',
      description: 'Electric mouse',
      image: 'pikachu.png',
      height: 4,
      weight: 60,
      types: ['Electric'],
    };
    vi.mocked(apiService.getItemById).mockResolvedValue(mockPokemon);

    render(
      <MemoryRouter initialEntries={['/pokemon/25']}>
        <Routes>
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText(/Loading details/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('Pikachu')).toBeInTheDocument();
    });
  });

  it('shows error if pokemon not found', async () => {
    vi.mocked(apiService.getItemById).mockResolvedValue(null);
    render(
      <MemoryRouter initialEntries={['/pokemon/999']}>
        <Routes>
          <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
        </Routes>
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});