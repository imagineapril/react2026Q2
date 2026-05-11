import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Item } from '../types';

describe('apiService', () => {
  const mockFetch = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', mockFetch);
    vi.resetModules();
  });

  it('getAllItems fetches and returns items', async () => {
    const { apiService } = await import('./api');

    const listResponse = {
      ok: true,
      json: async () => ({
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
        ],
      }),
    };
    mockFetch.mockResolvedValueOnce(listResponse);

    const detailResponse = {
      ok: true,
      json: async () => ({
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        sprites: {
          other: { 'official-artwork': { front_default: 'img' } },
          front_default: 'img',
        },
        types: [{ slot: 1, type: { name: 'grass' } }],
      }),
    };
    mockFetch.mockResolvedValueOnce(detailResponse);
    mockFetch.mockResolvedValueOnce(detailResponse);

    const items = await apiService.getAllItems();
    expect(items).toHaveLength(2);
    expect(items[0].name).toBe('Bulbasaur');
    expect(mockFetch).toHaveBeenCalledTimes(3);
  });

  it('getAllItems uses cache on subsequent calls', async () => {
    const { apiService } = await import('./api');

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: [] }),
    });
    await apiService.getAllItems();
    await apiService.getAllItems();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('getAllItems throws error on failed response', async () => {
    const { apiService } = await import('./api');

    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });
    await expect(apiService.getAllItems()).rejects.toThrow('API endpoint not found');
  });

  it('searchItems filters items based on search term', async () => {
    const { apiService } = await import('./api');

    const mockAll: Item[] = [
      {
        id: 1,
        name: 'Bulbasaur',
        description: '',
        image: '',
        height: 0,
        weight: 0,
        types: [],
      },
      {
        id: 2,
        name: 'Charmander',
        description: '',
        image: '',
        height: 0,
        weight: 0,
        types: [],
      },
    ];
    vi.spyOn(apiService, 'getAllItems').mockResolvedValue(mockAll);

    const result = await apiService.searchItems('charm');
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Charmander');
  });
});