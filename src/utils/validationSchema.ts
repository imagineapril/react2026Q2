import { z } from 'zod';

const availableCountries = [
  'Россия', 'США', 'Канада', 'Великобритания', 'Германия', 'Франция', 'Италия',
  'Испания', 'Китай', 'Япония', 'Индия', 'Бразилия', 'Австралия', 'Мексика',
  'Украина', 'Беларусь', 'Казахстан', 'Польша', 'Турция', 'ОАЭ'
];

const emailValidation = (value: string) => {
  const atIndex = value.indexOf('@');
  if (atIndex === -1) return false;
  const localPart = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);
  if (localPart.length === 0) return false;
  if (!domain.includes('.')) return false;
  return true;
};

export const formSchema = z.object({
  name: z.string()
    .min(1, 'Имя обязательно')
    .refine(val => {
      const firstChar = val.trim().charAt(0);
      return firstChar === firstChar.toUpperCase();
    }, 'Первая буква имени должна быть заглавной'),

  age: z.any()
    .refine(
      (val) => val !== undefined && val !== '' && !isNaN(Number(val)),
      'Возраст обязателен'
    )
    .refine(
      (val) => Number(val) >= 1,
      'Возраст не может быть меньше 1'
    )
    .refine(
      (val) => Number(val) <= 150,
      'Возраст не может быть больше 150'
    )
    .transform((val) => Number(val)),

  email: z.string()
    .min(1, 'Email обязателен')
    .refine(emailValidation, 'Некорректный формат email (должен содержать @ и точку в домене)'),

  gender: z.enum(['male', 'female', 'other']),

  terms: z.boolean().refine(val => val === true, 'Необходимо принять условия'),

  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .refine(val => /[0-9]/.test(val), 'Пароль должен содержать хотя бы одну цифру')
    .refine(val => /[A-Z]/.test(val), 'Пароль должен содержать хотя бы одну заглавную букву')
    .refine(val => /[a-z]/.test(val), 'Пароль должен содержать хотя бы одну строчную букву')
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), 'Пароль должен содержать хотя бы один спецсимвол'),

  confirmPassword: z.string().min(1, 'Подтверждение пароля обязательно'),

  country: z.string()
    .min(1, 'Выберите страну')
    .refine(val => availableCountries.includes(val), 'Страна не найдена в списке'),

  avatar: z.string()
    .min(1, 'Загрузите изображение (PNG/JPEG, до 5МБ)')
    .refine(base64 => base64.startsWith('data:image/png;') || base64.startsWith('data:image/jpeg;'), 'Допустимы только PNG и JPEG'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword'],
});

export type FormSchemaType = z.infer<typeof formSchema>;