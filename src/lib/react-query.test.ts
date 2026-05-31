import { queryClient } from './react-query';

test('queryClient has default options', () => {
  const defaults = queryClient.getDefaultOptions();
  expect(defaults.queries?.staleTime).toBeDefined();
  expect(defaults.queries?.gcTime).toBeDefined();
  expect(defaults.queries?.refetchOnWindowFocus).toBe(false);
  expect(defaults.queries?.retry).toBe(1);
});