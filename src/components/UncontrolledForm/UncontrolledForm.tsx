import { useRef, useState } from 'react';
import { useFormStore } from '../../store/useFormStore';
import { validateImage, checkPasswordStrength, getStrengthText } from '../../utils/formUtils';
import './UncontrolledForm.css';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

const initialStrength = {
  score: 0,
  criteria: { hasNumber: false, hasUppercase: false, hasLowercase: false, hasSpecial: false },
};

  const StrengthIndicator = ({ strength }: { strength: typeof initialStrength }) => {
    const { score, criteria } = strength;
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
  const [passwordStrength, setPasswordStrength] = useState(initialStrength);
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

  const handlePasswordChange = () => {
    const password = passwordRef.current?.value || '';
    const { score, criteria } = checkPasswordStrength(password);
    setPasswordStrength({ score, criteria });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim() || '';
    const age = Number(ageRef.current?.value);
    const email = emailRef.current?.value.trim() || '';
    const gender = genderRef.current?.value as 'male' | 'female' | 'other';
    const terms = termsRef.current?.checked || false;
    const password = passwordRef.current?.value || '';
    const confirmPassword = confirmPasswordRef.current?.value || '';
    const country = countryRef.current?.value.trim() || '';

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Имя обязательно';
    if (isNaN(age) || age <= 0) newErrors.age = 'Возраст должен быть положительным числом';
    if (!email.includes('@') || !email.includes('.')) newErrors.email = 'Введите корректный email';
    if (!terms) newErrors.terms = 'Необходимо принять условия';

    if (!password) newErrors.password = 'Пароль обязателен';
    else if (password.length < 6) newErrors.password = 'Пароль должен содержать минимум 6 символов';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Пароли не совпадают';
    
    if (!country) newErrors.country = 'Выберите страну';
    else if (!countries.includes(country)) newErrors.country = 'Страна не найдена в списке';
    
    if (!avatarBase64) newErrors.avatar = 'Загрузите изображение (PNG или JPEG)';
    else if (avatarError) newErrors.avatar = avatarError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addSubmission({
      name,
      age,
      email,
      gender,
      terms,
      password,
      country,
      avatar: avatarBase64,
    });

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
    setPasswordStrength(initialStrength);
    setErrors({});
    onSuccess();
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
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-age">Возраст:</label>
        <input
          id="uncontrolled-age"
          type="number"
          ref={ageRef}
          defaultValue=""
        />
        {errors.age && <span className="error-message">{errors.age}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-email">Email:</label>
        <input
          id="uncontrolled-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
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
        {errors.terms && <span className="error-message">{errors.terms}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-password">Пароль:</label>
        <input
          id="uncontrolled-password"
          type="password"
          ref={passwordRef}
          onChange={handlePasswordChange}
        />
        <StrengthIndicator strength={passwordStrength}/>
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="uncontrolled-confirm">Подтверждение пароля:</label>
        <input id="uncontrolled-confirm" type="password" ref={confirmPasswordRef} />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
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
        {errors.country && <span className="error-message">{errors.country}</span>}
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
        {(errors.avatar || avatarError) && (
          <span className="error-message">{errors.avatar || avatarError}</span>
        )}
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
};