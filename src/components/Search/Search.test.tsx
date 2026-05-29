import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Search from './Search';

describe('Search Component', () => {

  it('renders input field and search button', () => {
    render(<Search onSearch={() => {}} />);
    expect(screen.getByPlaceholderText('Enter pokemon name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={() => {}} initialValue="pikachu" />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    expect(input).toHaveValue('pikachu');
  });

  it('updates input value when user types', () => {
    render(<Search onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'charmander' } });
    expect(input).toHaveValue('charmander');
  });

  it('calls onSearch with trimmed value when search button is clicked', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: '  bulbasaur  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('bulbasaur');
  });

  it('calls onSearch with trimmed value when Enter key is pressed', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    const input = screen.getByPlaceholderText('Enter pokemon name');
    fireEvent.change(input, { target: { value: 'squirtle' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    expect(onSearch).toHaveBeenCalledWith('squirtle');
  });

  it('calls onSearch with empty string when search is empty', () => {
    const onSearch = vi.fn();
    render(<Search onSearch={onSearch} />);
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    expect(onSearch).toHaveBeenCalledWith('');
  });
});