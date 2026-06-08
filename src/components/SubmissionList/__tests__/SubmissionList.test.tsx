import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { SubmissionList } from '../SubmissionList';
import { useFormStore } from '../../../store/useFormStore';

type MockStore = {
  submissions: Array<{
    id: string;
    name: string;
    age: number;
    email: string;
    gender: string;
    terms: boolean;
    password: string;
    country: string;
    avatar: string;
    submittedAt: number;
  }>;
};

vi.mock('../../../store/useFormStore', () => ({
  useFormStore: vi.fn((selector: (state: MockStore) => unknown) => selector({
    submissions: [],
  })),
}));

describe('SubmissionList', () => {
  beforeEach(() => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: MockStore) => unknown) => selector({
        submissions: [],
      })
    );
  });

  it('shows no data message when submissions empty', () => {
    render(<SubmissionList />);
    expect(screen.getByText('Нет отправленных форм')).toBeInTheDocument();
  });

  it('renders submissions as cards', () => {
    const mockSubmissions = [
      {
        id: '1',
        name: 'Иван',
        age: 30,
        email: 'ivan@test.com',
        gender: 'male',
        terms: true,
        password: 'pass',
        country: 'Россия',
        avatar: 'data:image/png;base64,xxx',
        submittedAt: Date.now(),
      },
      {
        id: '2',
        name: 'Мария',
        age: 25,
        email: 'maria@test.com',
        gender: 'female',
        terms: true,
        password: 'pass',
        country: 'США',
        avatar: '',
        submittedAt: Date.now(),
      },
    ];

    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: MockStore) => unknown) => selector({
        submissions: mockSubmissions,
      })
    );

    render(<SubmissionList />);
    expect(screen.getByText('Иван')).toBeInTheDocument();
    expect(screen.getByText('Мария')).toBeInTheDocument();
    expect(screen.getByText('Россия')).toBeInTheDocument();
    expect(screen.getByText('США')).toBeInTheDocument();
  });

  it('shows avatar image when avatar is provided', () => {
    const mockSubmissions = [
      {
        id: '1',
        name: 'Иван',
        age: 30,
        email: 'ivan@test.com',
        gender: 'male',
        terms: true,
        password: 'pass',
        country: 'Россия',
        avatar: 'data:image/png;base64,xxx',
        submittedAt: Date.now(),
      },
    ];

    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: MockStore) => unknown) => selector({
        submissions: mockSubmissions,
      })
    );

    render(<SubmissionList />);
    const avatar = document.querySelector('.avatar') as HTMLImageElement;
    expect(avatar).toBeInTheDocument();
    expect(avatar.src).toContain('data:image/png;base64');
  });

  it('adds new-submission class to the latest submission', async () => {
    const mockSubmissions = [
      {
        id: '1',
        name: 'Иван',
        age: 30,
        email: 'ivan@test.com',
        gender: 'male',
        terms: true,
        password: 'pass',
        country: 'Россия',
        avatar: '',
        submittedAt: Date.now(),
      },
    ];

    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: MockStore) => unknown) => selector({
        submissions: mockSubmissions,
      })
    );

    render(<SubmissionList />);

    await waitFor(() => {
      const card = document.querySelector('.submission-card');
      expect(card).toHaveClass('new-submission');
    });

    await waitFor(() => {
      const card = document.querySelector('.submission-card');
      expect(card).not.toHaveClass('new-submission');
    }, { timeout: 3500 });
  });
});