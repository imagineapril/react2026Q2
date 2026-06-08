import { describe, it, expect } from 'vitest';
import { formSchema } from '../validationSchema';

describe('formSchema', () => {
  const validData = {
    name: 'Иван',
    age: 25,
    email: 'ivan@example.com',
    gender: 'male' as const,
    terms: true,
    password: 'Aa1!abcd',
    confirmPassword: 'Aa1!abcd',
    country: 'Россия',
    avatar: 'data:image/png;base64,xxx',
  };

  it('validates correct data', () => {
    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('requires name', () => {
    const result = formSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Имя обязательно');
  });

  it('requires uppercase first letter of name', () => {
    const result = formSchema.safeParse({ ...validData, name: 'иван' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Первая буква имени должна быть заглавной');
  });

  it('validates age is number and positive', () => {
    let result = formSchema.safeParse({ ...validData, age: undefined as unknown as number });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Возраст обязателен');

    result = formSchema.safeParse({ ...validData, age: 0 });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Возраст не может быть меньше 1');
  });

  it('validates email format', () => {
    let result = formSchema.safeParse({ ...validData, email: 'test@' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain('Некорректный формат email');

    result = formSchema.safeParse({ ...validData, email: 'test@domain' });
    expect(result.success).toBe(false);
  });

  it('requires terms acceptance', () => {
    const result = formSchema.safeParse({ ...validData, terms: false });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Необходимо принять условия');
  });

  it('validates password strength', () => {
    let result = formSchema.safeParse({ ...validData, password: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.message.includes('минимум 6 символов'))).toBe(true);

    result = formSchema.safeParse({ ...validData, password: 'abcdef', confirmPassword: 'abcdef' });
    expect(result.success).toBe(false);
  });

  it('requires matching passwords', () => {
    const result = formSchema.safeParse({ ...validData, confirmPassword: 'different' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Пароли не совпадают');
  });

  it('validates country exists', () => {
    const result = formSchema.safeParse({ ...validData, country: 'Несуществующая' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Страна не найдена в списке');
  });

  it('validates avatar is not empty and has correct mime', () => {
    let result = formSchema.safeParse({ ...validData, avatar: '' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Загрузите изображение (PNG/JPEG, до 5МБ)');

    result = formSchema.safeParse({ ...validData, avatar: 'data:image/gif;base64,' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe('Допустимы только PNG и JPEG');
  });
});