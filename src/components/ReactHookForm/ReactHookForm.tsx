import { useForm } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';

interface ReactHookFormProps {
  onSuccess: () => void;
}

interface FormInputs {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female' | 'other';
  terms: boolean;
  password?: string;
  confirmPassword?: string;
  country?: string;
  avatar?: string;
}

export const ReactHookForm = ({ onSuccess }: ReactHookFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: 'male',
      terms: false,
    },
  });

  const validateEmail = (value: string) => {
    if (!value) return 'Email обязателен';
    const atIndex = value.indexOf('@');
    if (atIndex === -1) return 'Email должен содержать @';
    const localPart = value.slice(0, atIndex);
    const domain = value.slice(atIndex + 1);
    if (localPart.length === 0) return 'Локальная часть email не может быть пустой';
    if (!domain.includes('.')) return 'Домен должен содержать точку';
    return true;
  };

  const onSubmit = (data: FormInputs) => {
    addSubmission({
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      terms: data.terms,
      password: data.password || '',
      country: data.country || '',
      avatar: data.avatar || '',
    });
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="rhf-name">Имя:</label>
        <input
          id="rhf-name"
          type="text"
          {...register('name', {
            required: 'Имя обязательно',
            validate: (value) => {
              if (!value) return true;
              const firstChar = value.trim().charAt(0);
              if (firstChar !== firstChar.toUpperCase()) {
                return 'Первая буква должна быть заглавной';
              }
              return true;
            },
          })}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name.message}</span>}
      </div>

      <div>
        <label htmlFor="rhf-age">Возраст:</label>
        <input
          id="rhf-age"
          type="number"
          {...register('age', {
            required: 'Возраст обязателен',
            valueAsNumber: true,
            min: { value: 1, message: 'Возраст должен быть больше 0' },
            max: { value: 150, message: 'Возраст не может быть больше 150' },
          })}
        />
        {errors.age && <span style={{ color: 'red' }}>{errors.age.message}</span>}
      </div>

      <div>
        <label htmlFor="rhf-email">Email:</label>
        <input
          id="rhf-email"
          type="email"
          {...register('email', {
            required: 'Email обязателен',
            validate: validateEmail,
          })}
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email.message}</span>}
      </div>

      <div>
        <label htmlFor="rhf-gender">Пол:</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('terms', { required: 'Необходимо принять условия' })} />
          Я принимаю условия
        </label>
        {errors.terms && <span style={{ color: 'red' }}>{errors.terms.message}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Отправить
      </button>
    </form>
  );
};