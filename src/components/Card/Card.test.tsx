import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from './Card';
import type { CardProps } from '../../types';

describe('Card Component', () => {
  const mockCardProps: CardProps = {
    name: 'Pikachu',
    description: 'Height: 0.4m | Weight: 6.0kg | Type: electric',
    image: 'https://example.com/pikachu.png',
    height: 4,
    weight: 60,
    types: ['electric'],
  };

  it('renders pokemon name', () => {
    render(<Card {...mockCardProps} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
  });

  it('renders pokemon description', () => {
    render(<Card {...mockCardProps} />);
    expect(screen.getByText(/Height: 0.4m/i)).toBeInTheDocument();
    expect(screen.getByText(/Weight: 6.0kg/i)).toBeInTheDocument();
    expect(screen.getByText(/Type: electric/i)).toBeInTheDocument();
  });

  it('renders pokemon types', () => {
    render(<Card {...mockCardProps} />);
    expect(screen.getByText('electric')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(<Card {...mockCardProps} />);
    const image = screen.getByAltText('Pikachu');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
  });

  it('does not render image section when image is not provided', () => {
    const propsWithoutImage: CardProps = {
      name: 'Pikachu',
      description: 'Test',
      types: [],
    };
    const { container } = render(<Card {...propsWithoutImage} />);
    const imageContainer = container.querySelector('.imageContainer');
    expect(imageContainer).toBeNull();
  });

  it('handles missing types gracefully', () => {
    const propsWithoutTypes: CardProps = {
      name: 'Pikachu',
      description: 'Test',
    };
    render(<Card {...propsWithoutTypes} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    const typesElement = screen.queryByText('electric');
    expect(typesElement).not.toBeInTheDocument();
  });

  it('handles empty types array', () => {
    const propsWithEmptyTypes: CardProps = {
      name: 'Pikachu',
      description: 'Test',
      types: [],
    };
    render(<Card {...propsWithEmptyTypes} />);
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    const typesElement = screen.queryByText('electric');
    expect(typesElement).not.toBeInTheDocument();
  });

  it('applies correct color based on pokemon type', () => {
    render(<Card {...mockCardProps} />);
    const nameElement = screen.getByText('Pikachu');
    expect(nameElement).toHaveStyle({ color: '#f8d030' });
  });

  it('uses first type for color when multiple types exist', () => {
    const multiTypeProps: CardProps = {
      name: 'Bulbasaur',
      description: 'Test',
      types: ['grass', 'poison'],
    };
    render(<Card {...multiTypeProps} />);
    const nameElement = screen.getByText('Bulbasaur');
    expect(nameElement).toHaveStyle({ color: '#78c850' });
  });
});