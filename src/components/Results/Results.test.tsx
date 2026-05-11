import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Results from './Results';
import styles from './Results.module.css';
import type { Item } from '../../types';

describe('Results Component', () => {
  const mockItems: Item[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      description: 'Height: 0.7m | Weight: 6.9kg | Type: grass/poison',
      image: 'https://example.com/bulbasaur.png',
      height: 7,
      weight: 69,
      types: ['grass', 'poison'],
    },
    {
      id: 2,
      name: 'Charmander',
      description: 'Height: 0.6m | Weight: 8.5kg | Type: fire',
      image: 'https://example.com/charmander.png',
      height: 6,
      weight: 85,
      types: ['fire'],
    },
  ];

  it('renders results count', () => {
    render(<Results items={mockItems} />);
    expect(screen.getByText('Results (2)')).toBeInTheDocument();
  });

  it('renders correct number of items', () => {
    render(<Results items={mockItems} />);
    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('Charmander')).toBeInTheDocument();
  });

  it('displays no results message when items array is empty', () => {
    render(<Results items={[]} />);
    expect(screen.getByText(/No items found/i)).toBeInTheDocument();
    expect(screen.getByText('Results (0)')).toBeInTheDocument();
  });

  it('handles items without optional fields', () => {
    const minimalItems: Item[] = [
      {
        id: 3,
        name: 'Minimal Pokemon',
        description: 'Minimal description',
      },
    ];
    render(<Results items={minimalItems} />);
    expect(screen.getByText('Minimal Pokemon')).toBeInTheDocument();
    expect(screen.getByText('Minimal description')).toBeInTheDocument();
  });

  it('does not render cards list when items are empty', () => {
    const { container } = render(<Results items={[]} />);
    const cardsList = container.querySelector('.cardsList');
    expect(cardsList).toBeNull();
  });

  it('renders cards list when items exist', () => {
    const { container } = render(<Results items={mockItems} />);
    const cardsList = container.querySelector(`.${styles.cardsList}`);
    expect(cardsList).toBeInTheDocument();
  });
});