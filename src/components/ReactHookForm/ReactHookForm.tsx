import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useFormStore } from '../../store/useFormStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateImage, checkPasswordStrength, getStrengthText } from '../../utils/formUtils';
import { formSchema, type FormSchemaType } from '../../utils/validationSchema';
import '../FormStyles.css';

interface ReactHookFormProps {
  onSuccess: () => void;
}

const PasswordStrength = ({ password }: { password: string }) => {
    const { score, criteria } = checkPasswordStrength(password);
    const width = `${(score / 4) * 100}%`;
    const color =
      score === 0 ? '#ff4d4f' :
      score === 1 ? '#ffa940' :
      score === 2 ? '#fadb14' :
      score === 3 ? '#52c41a' :
      '#1890ff';

    return (
      <div>
        <div className="strength-bar">
          <div className="strength-fill" style={{ width, backgroundColor: color }} />
        </div>
        <div className="strength-text" style={{ color }}>{getStrengthText(score)}</div>
        <div className="strength-hint">
          {!criteria.hasNumber && '• цифра '}
          {!criteria.hasUppercase && '• заглавная буква '}
          {!criteria.hasLowercase && '• строчная буква '}
          {!criteria.hasSpecial && '• спецсимвол (!@#$...)'}
          {score === 4 && '✓ Отличный пароль!'}
        </div>
      </div>
    );
  };

export const ReactHookForm = ({ onSuccess }: ReactHookFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: undefined,
      email: '',
      gender: 'male',
      terms: false,
      password: '',
      confirmPassword: '',
      country: '',
      avatar: '',
    },
  });

  const watchPassword = watch('password');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue('avatar', '');
      setAvatarPreview('');
      setAvatarError('');
      return;
    }
    try {
      const base64 = await validateImage(file);
      setValue('avatar', base64, { shouldValidate: true });
      setAvatarPreview(base64);
      setAvatarError('');
    } catch (err) {
      setAvatarError((err as Error).message);
      setValue('avatar', '');
      setAvatarPreview('');
      e.target.value = '';
    }
  };

  const onSubmit = (data: FormSchemaType) => {
    addSubmission({
      name: data.name,
      age: data.age,
      email: data.email,
      gender: data.gender,
      terms: data.terms,
      password: data.password,
      country: data.country,
      avatar: data.avatar,
    });
    reset();
    setAvatarPreview('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="rhf-name">Имя:</label>
        <input
          id="rhf-name"
          type="text"
          {...register('name')}
        />
        {errors.name && <span className="error-message">{errors.name.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-age">Возраст:</label>
        <input
          id="rhf-age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <span className="error-message">{errors.age.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-email">Email:</label>
        <input
          id="rhf-email"
          type="email"
          {...register('email')}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-gender">Пол:</label>
        <select id="rhf-gender" {...register('gender')}>
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input type="checkbox" {...register('terms')} />
          Я принимаю условия
        </label>
        {errors.terms && <span className="error-message">{errors.terms.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-password">Пароль:</label>
        <input
          id="rhf-password"
          type="password"
          {...register('password')}
        />
        {watchPassword && <PasswordStrength password={watchPassword} />}
        {errors.password && <span className="error-message">{errors.password.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-confirm">Подтверждение пароля:</label>
        <input
          id="rhf-confirm"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-country">Страна:</label>
        <input
          id="rhf-country"
          type="text"
          list="countries-list"
          autoComplete="off"
          {...register('country')}
        />
        <datalist id="countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.country && <span className="error-message">{errors.country.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="rhf-avatar">Загрузить фото (PNG/JPEG, до 5МБ):</label>
        <input
          id="rhf-avatar"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        {avatarPreview && (
          <div className="avatar-preview">
            <img src={avatarPreview} alt="preview" />
          </div>
        )}
        {avatarError && <span className="error-message">{avatarError}</span>}
        {errors.avatar && <span className="error-message">{errors.avatar.message}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Отправить
      </button>
    </form>
  );
};