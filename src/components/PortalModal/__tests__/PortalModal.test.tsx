import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PortalModal } from '../PortalModal';

vi.mock('react-dom', () => ({
  createPortal: (children: React.ReactNode) => children,
}));

describe('PortalModal', () => {
  it('renders nothing when isOpen is false', () => {
    render(
      <PortalModal isOpen={false} onClose={() => {}}>
        <div>Modal content</div>
      </PortalModal>
    );
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('renders content when isOpen is true', () => {
    render(
      <PortalModal isOpen={true} onClose={() => {}}>
        <div>Modal content</div>
      </PortalModal>
    );
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('calls onClose when Escape is pressed', () => {
    const onClose = vi.fn();
    render(
      <PortalModal isOpen={true} onClose={onClose}>
        <div>Modal</div>
      </PortalModal>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking on overlay', () => {
    const onClose = vi.fn();
    render(
      <PortalModal isOpen={true} onClose={onClose}>
        <div>Modal</div>
      </PortalModal>
    );
    const overlay = document.querySelector('.modal-overlay');
    fireEvent.click(overlay!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn();
    render(
      <PortalModal isOpen={true} onClose={onClose}>
        <div>Modal content</div>
      </PortalModal>
    );
    const content = document.querySelector('.modal-content');
    fireEvent.click(content!);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has close button that calls onClose', () => {
    const onClose = vi.fn();
    render(
      <PortalModal isOpen={true} onClose={onClose}>
        <div>Modal</div>
      </PortalModal>
    );
    const closeButton = screen.getByLabelText('Закрыть');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});