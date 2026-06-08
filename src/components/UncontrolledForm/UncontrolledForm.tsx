import { useRef, useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { validateImage, checkPasswordStrength, getStrengthText } from '../../utils/formUtils';
import { formSchema } from '../../utils/validationSchema';
import { z } from 'zod';
import '../FormStyles.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const StrengthIndicator = ({ password }: { password: string }) => {
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

export const UncontrolledForm = ({ onSuccess }: UncontrolledFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const countries = useFormStore((state) => state.countries);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const [avatarBase64, setAvatarBase64] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [avatarError, setAvatarError] = useState<string>('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAvatarBase64('');
      setAvatarPreview('');
      setAvatarError('');
      return;
    }
    try {
      const base64 = await validateImage(file);
      setAvatarBase64(base64);
      setAvatarPreview(base64);
      setAvatarError('');
    } catch (err) {
      setAvatarError((err as Error).message);
      setAvatarBase64('');
      setAvatarPreview('');
      if (avatarRef.current) avatarRef.current.value = '';
    }
  };

  const [password, setPassword] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setErrors(prev => ({ ...prev }));
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const formData = {
      name: nameRef.current?.value.trim() || '',
      age: ageRef.current?.value === '' ? NaN : Number(ageRef.current?.value),
      email: emailRef.current?.value.trim() || '',
      gender: genderRef.current?.value as 'male' | 'female' | 'other',
      terms: termsRef.current?.checked || false,
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      country: countryRef.current?.value.trim() || '',
      avatar: avatarBase64,
    }

    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((err: z.ZodIssue) => {
        const field = err.path[0];
        if (field !== undefined) {
          formattedErrors[String(field)] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }
    const validData = result.data;
    addSubmission({...validData });

    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (genderRef.current) genderRef.current.value = 'male';
    if (termsRef.current) termsRef.current.checked = false;
    if (passwordRef.current) passwordRef.current.value = '';
    if (confirmPasswordRef.current) confirmPasswordRef.current.value = '';
    if (countryRef.current) countryRef.current.value = '';
    if (avatarRef.current) avatarRef.current.value = '';

    setAvatarBase64('');
    setAvatarPreview('');
    setErrors({});
    onSuccess();
    setPassword('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="uncontrolled-name">Имя:</label>
        <input
          id="uncontrolled-name"
          type="text"
          ref={nameRef}
          defaultValue=""
        />
        <div className="error-message">{errors.name}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-age">Возраст:</label>
        <input
          id="uncontrolled-age"
          type="number"
          ref={ageRef}
          defaultValue=""
        />
        <div className="error-message">{errors.age}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-email">Email:</label>
        <input
          id="uncontrolled-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
        <div className="error-message">{errors.email}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-gender">Пол:</label>
        <select id="uncontrolled-gender" ref={genderRef} defaultValue="male">
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div className="form-group checkbox-group">
        <label>
          <input type="checkbox" ref={termsRef} />
          Я принимаю условия
        </label>
        <div className="error-message">{errors.terms}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-password">Пароль:</label>
        <input
          id="uncontrolled-password"
          type="password"
          ref={passwordRef}
          onChange={handlePasswordChange}
        />
        {password && <StrengthIndicator password={password} />}
        <div className="error-message">{errors.password || errors.confirmPassword}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-confirm">Подтверждение пароля:</label>
        <input id="uncontrolled-confirm" type="password" ref={confirmPasswordRef} />
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-country">Страна:</label>
        <input
          id="uncontrolled-country"
          type="text"
          ref={countryRef}
          list="countries-list"
          autoComplete="off"
          defaultValue=""
        />
        <datalist id="countries-list">
          {countries.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        <div className="error-message">{errors.country}</div>
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-avatar">Загрузить фото (PNG/JPEG, до 5МБ):</label>
        <input
          id="uncontrolled-avatar"
          type="file"
          ref={avatarRef}
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
        />
        {avatarPreview && (
          <div className="avatar-preview">
            <img src={avatarPreview} alt="preview" />
          </div>
        )}
        <div className="error-message">{errors.avatar || avatarError}</div>
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
};