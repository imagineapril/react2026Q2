import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactHookForm } from '../ReactHookForm';
import { useFormStore } from '../../../store/useFormStore';

type MockStore = {
  addSubmission: ReturnType<typeof vi.fn>;
  countries: string[];
  submissions: unknown[];
};

vi.mock('../../../store/useFormStore', () => ({
  useFormStore: vi.fn((selector: (state: MockStore) => unknown) => selector({
    addSubmission: vi.fn(),
    countries: ['Россия', 'США'],
    submissions: [],
  })),
}));

describe('ReactHookForm', () => {
  const mockAddSubmission = vi.fn();
  const mockCountries = ['Россия', 'США'];

  beforeEach(() => {
    const mockStore = {
      addSubmission: mockAddSubmission,
      countries: mockCountries,
      submissions: [],
    };
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      (selector: (state: MockStore) => unknown) => selector(mockStore)
    );
  });

  it('renders all fields', () => {
    render(<ReactHookForm onSuccess={() => {}} />);
    expect(screen.getByLabelText(/Имя/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Возраст/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пол/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Пароль/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Подтверждение пароля/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Страна/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Загрузить фото/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Отправить/ })).toBeInTheDocument();
  });

  it('disables submit button when form is invalid', async () => {
    render(<ReactHookForm onSuccess={() => {}} />);
    const submitButton = screen.getByRole('button', { name: /Отправить/ });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when form becomes valid', async () => {
    const user = userEvent.setup();
    render(<ReactHookForm onSuccess={() => {}} />);
    
    await user.type(screen.getByLabelText(/Имя/), 'Иван');
    await user.type(screen.getByLabelText(/Возраст/), '25');
    await user.type(screen.getByLabelText(/Email/), 'ivan@test.com');
    await user.selectOptions(screen.getByLabelText(/Пол/), 'male');
    await user.click(screen.getByLabelText(/Я принимаю условия/));
    await user.type(screen.getByLabelText(/Пароль/), 'Aa1!test');
    await user.type(screen.getByLabelText(/Подтверждение пароля/), 'Aa1!test');
    await user.type(screen.getByLabelText(/Страна/), 'Россия');
    
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Загрузить фото/);
    await user.upload(fileInput, file);

    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: /Отправить/ });
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('submits valid data and calls addSubmission', async () => {
    const onSuccess = vi.fn();
    const user = userEvent.setup();
    render(<ReactHookForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/Имя/), 'Иван');
    await user.type(screen.getByLabelText(/Возраст/), '25');
    await user.type(screen.getByLabelText(/Email/), 'ivan@test.com');
    await user.selectOptions(screen.getByLabelText(/Пол/), 'male');
    await user.click(screen.getByLabelText(/Я принимаю условия/));
    await user.type(screen.getByLabelText(/Пароль/), 'Aa1!test');
    await user.type(screen.getByLabelText(/Подтверждение пароля/), 'Aa1!test');
    await user.type(screen.getByLabelText(/Страна/), 'Россия');

    const file = new File(['dummy'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/Загрузить фото/);
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.queryByText(/Допустимые форматы/)).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: /Отправить/ }));

    await waitFor(() => {
      expect(mockAddSubmission).toHaveBeenCalled();
    });
    expect(onSuccess).toHaveBeenCalled();
  });

  it('displays validation errors', async () => {
    const user = userEvent.setup();
    render(<ReactHookForm onSuccess={() => {}} />);
    
    await user.type(screen.getByLabelText(/Имя/), 'иван');
    await user.type(screen.getByLabelText(/Возраст/), '0');
    await user.type(screen.getByLabelText(/Email/), 'invalid');
    await user.type(screen.getByLabelText(/Пароль/), 'short');
    
    await user.click(screen.getByRole('button', { name: /Отправить/ }));

    await waitFor(() => {
      expect(screen.getByText(/Первая буква имени должна быть заглавной/)).toBeInTheDocument();
      expect(screen.getByText(/Возраст не может быть меньше 1/)).toBeInTheDocument();
      expect(screen.getByText(/Некорректный формат email/)).toBeInTheDocument();
      expect(screen.getByText(/минимум 6 символов/)).toBeInTheDocument();
    });
  });
});