import { 
  fetchPokemonList,
  fetchPokemonDetail,
  fetchPokemonSpecies,
  fetchFullPokemonItem,
  fetchPokemonPage,
  fetchTotalCount
} from './pokeApi';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetAllMocks();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('fetchPokemonList returns data', async () => {
  const mockData = { results: [{ name: 'bulbasaur', url: '' }] };
  fetchMock.mockResolvedValue({ ok: true, json: async () => mockData });
  const result = await fetchPokemonList(1, 0);
  expect(result).toEqual(mockData.results);
  expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=1&offset=0');
});

test('fetchPokemonList throws on error', async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(fetchPokemonList()).rejects.toThrow('Failed to fetch pokemon list');
});

test('fetchPokemonDetail returns data', async () => {
  const mockDetail = { id: 1, name: 'bulbasaur', height: 7, weight: 69, sprites: { other: { 'official-artwork': { front_default: '' } } }, types: [] };
  fetchMock.mockResolvedValue({ ok: true, json: async () => mockDetail });
  const result = await fetchPokemonDetail(1);
  expect(result).toEqual(mockDetail);
});

test('fetchPokemonDetail throws on error', async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(fetchPokemonDetail(1)).rejects.toThrow('Failed to fetch pokemon detail');
});

test('fetchPokemonSpecies returns data', async () => {
  const mockSpecies = { flavor_text_entries: [] };
  fetchMock.mockResolvedValue({ ok: true, json: async () => mockSpecies });
  const result = await fetchPokemonSpecies(1);
  expect(result).toEqual(mockSpecies);
});

test('fetchPokemonSpecies throws on error', async () => {
  fetchMock.mockResolvedValue({ ok: false });
  await expect(fetchPokemonSpecies(1)).rejects.toThrow('Failed to fetch pokemon species');
});

test('fetchFullPokemonItem combines data', async () => {
  const mockDetail = { id: 1, name: 'bulbasaur', height: 7, weight: 69, sprites: { other: { 'official-artwork': { front_default: 'img.png' } } }, types: [{ type: { name: 'grass' } }] };
  const mockSpecies = { flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'desc' }] };
  fetchMock
    .mockResolvedValueOnce({ ok: true, json: async () => mockDetail })
    .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });
  const result = await fetchFullPokemonItem(1);
  expect(result.name).toBe('Bulbasaur');
  expect(result.description).toBe('desc');
});

test('fetchPokemonPage returns paginated items', async () => {
  const mockResponse = { count: 151, results: [{ name: 'bulbasaur' }] };
  fetchMock
    .mockResolvedValueOnce({ ok: true, json: async () => mockResponse })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, name: 'bulbasaur', height: 7, weight: 69, sprites: { other: { 'official-artwork': { front_default: '' } } }, types: [] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ flavor_text_entries: [{ language: { name: 'en' }, flavor_text: 'desc' }] }) });
  const result = await fetchPokemonPage(1, 1);
  expect(result.total).toBe(151);
  expect(result.items).toHaveLength(1);
});

test('fetchTotalCount returns count', async () => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ count: 1010 }) });
  const count = await fetchTotalCount();
  expect(count).toBe(1010);
});