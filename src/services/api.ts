import type { Item } from '../types';

const MOCK_ITEMS: Item[] = [
  { id: 1, name: 'React Basics', description: 'Learn the fundamentals of React' },
  { id: 2, name: 'Class Components', description: 'Deep dive into class components' },
  { id: 3, name: 'Error Boundaries', description: 'Handle errors gracefully in React' },
  { id: 4, name: 'API Integration', description: 'Connect your app to REST APIs' },
  { id: 5, name: 'CSS Modules', description: 'Scoped styling in React' },
];

export const apiService = {
  getAllItems: async (): Promise<Item[]> => {
    // TODO: API request for getting all items

    console.log('Getting all items (mock data)');
    return [...MOCK_ITEMS];
  },

  searchItems: async (searchTerm: string): Promise<Item[]> => {
    // TODO: API request for getting searched items

    console.log(`Searching for "${searchTerm}" (mock data)`);

    const filtered = MOCK_ITEMS.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered;
  },
};