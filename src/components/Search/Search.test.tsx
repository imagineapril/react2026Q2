import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Search from './Search';

describe('Search Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders input field and search button', () => {
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Enter pokemon name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('displays saved search term from localStorage on mount', () => {
    localStorage.setItem('pokemonSearchTerm', '"pikachu"');
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    expect(input).toHaveValue('pikachu');
  });

  it('shows empty input when no saved term exists', () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    expect(input).toHaveValue('');
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'charmander' } });
    expect(input).toHaveValue('charmander');
  });

  it('saves search term to localStorage when search button is clicked', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: '  bulbasaur  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('"bulbasaur"');
    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('saves search term to localStorage when Enter key is pressed', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'squirtle' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('"squirtle"');
    expect(onSearch).toHaveBeenCalledWith('squirtle');
  });

  it('removes localStorage item when search term is only spaces', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('""');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('calls onSearch with empty string when search is empty', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('""');
    expect(onSearch).toHaveBeenCalledWith('');
  });

  it('overwrites existing localStorage value when new search is performed', () => {
    localStorage.setItem('pokemonSearchTerm', '"old"');
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(localStorage.getItem('pokemonSearchTerm')).toBe('"new"');
    expect(onSearch).toHaveBeenCalledWith('new');
  });
});