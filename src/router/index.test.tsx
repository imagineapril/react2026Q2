import { router } from './index';

test('router is defined', () => {
  expect(router).toBeDefined();
  expect(router.routes).toHaveLength(1);
});