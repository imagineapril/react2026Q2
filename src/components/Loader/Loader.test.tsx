import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Loader from './Loader';
import styles from './Loader.module.css';

describe('Loader Component', () => {
  it('renders loading text', () => {
    render(<Loader />);
    expect(screen.getByText('Loading Pokémon...')).toBeInTheDocument();
  });

  it('renders pokeball loader with correct CSS class', () => {
    const { container } = render(<Loader />);
    const pokeballDiv = container.querySelector(`.${styles.pokeballLoader}`);
    expect(pokeballDiv).toBeInTheDocument();
  });

  it('renders all pokeball parts', () => {
    const { container } = render(<Loader />);
    
    expect(container.querySelector(`.${styles.pokeballTop}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.pokeballBottom}`)).toBeInTheDocument();
    expect(container.querySelector(`.${styles.pokeballButton}`)).toBeInTheDocument();
  });
});