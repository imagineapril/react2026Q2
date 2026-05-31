import { fetchPokemonPage } from './pokeApi';

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

test('fetchPokemonPage returns data', async () => {
  const mockResponse = { count: 151, results: [] };
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => mockResponse,
  } as Response);

  const result = await fetchPokemonPage(1);
  expect(result.total).toBe(151);
  expect(fetchMock).toHaveBeenCalledWith(
    'https://pokeapi.co/api/v2/pokemon?limit=20&offset=0'
  );
});

test('fetchPokemonPage throws error on failed response', async () => {
  const fetchMock = vi.mocked(fetch);
  fetchMock.mockResolvedValue({
    ok: false,
    status: 500,
  } as Response);

  await expect(fetchPokemonPage(1)).rejects.toThrow('Failed to fetch pokemon list');
});