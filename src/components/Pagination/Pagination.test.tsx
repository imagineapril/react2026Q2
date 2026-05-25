import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './Pagination';
import styles from './Pagination.module.css';

describe('Pagination', () => {
  const mockOnPageChange = vi.fn();

  it('renders buttons for current page', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    const activeButton = screen.getByText('3');
    expect(activeButton).toHaveClass(styles.active);
  });

  it('disables Previous button on first page', () => {
    render(<Pagination currentPage={1} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination currentPage={10} totalPages={10} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange with correct page when button clicked', () => {
    render(<Pagination currentPage={3} totalPages={10} onPageChange={mockOnPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPageChange).toHaveBeenCalledWith(4);
    fireEvent.click(screen.getByText('Previous'));
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText('5'));
    expect(mockOnPageChange).toHaveBeenCalledWith(5);
  });

  it('shows ellipsis when many pages', () => {
    render(<Pagination currentPage={5} totalPages={20} onPageChange={mockOnPageChange} />);
    const ellipsisElements = screen.getAllByText('...');
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });
});