import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

vi.mock('../components/PortalModal/PortalModal', () => ({
  PortalModal: ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => (
    isOpen ? <div data-testid="modal">{children}</div> : null
  ),
}));
vi.mock('../components/UncontrolledForm/UncontrolledForm', () => ({
  UncontrolledForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess} data-testid="uncontrolled-form">UncontrolledForm</button>
  ),
}));
vi.mock('../components/ReactHookForm/ReactHookForm', () => ({
  ReactHookForm: ({ onSuccess }: { onSuccess: () => void }) => (
    <button onClick={onSuccess} data-testid="rhf-form">ReactHookForm</button>
  ),
}));
vi.mock('../components/SubmissionList/SubmissionList', () => ({
  SubmissionList: () => <div data-testid="submission-list">SubmissionList</div>,
}));

describe('App', () => {
  it('renders main components', () => {
    render(<App />);
    expect(screen.getByText('React Forms')).toBeInTheDocument();
    expect(screen.getByText('Открыть Uncontrolled форму')).toBeInTheDocument();
    expect(screen.getByText('Открыть React Hook Form')).toBeInTheDocument();
    expect(screen.getByTestId('submission-list')).toBeInTheDocument();
  });

  it('opens uncontrolled modal when button clicked', () => {
    render(<App />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Открыть Uncontrolled форму'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('opens RHF modal when button clicked', () => {
    render(<App />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Открыть React Hook Form'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('rhf-form')).toBeInTheDocument();
  });

  it('closes modal when onSuccess called from form', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Открыть Uncontrolled форму'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('uncontrolled-form'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});