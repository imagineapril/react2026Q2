import { useRef, useState } from 'react';
import { useFormStore } from '../../store/useFormStore';

interface UncontrolledFormProps {
  onSuccess: () => void;
}

export const UncontrolledForm = ({ onSuccess }: UncontrolledFormProps) => {
  const addSubmission = useFormStore((state) => state.addSubmission);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const nameRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const termsRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const name = nameRef.current?.value.trim() || '';
    const age = Number(ageRef.current?.value);
    const email = emailRef.current?.value.trim() || '';
    const gender = genderRef.current?.value as 'male' | 'female' | 'other';
    const terms = termsRef.current?.checked || false;

    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = 'Имя обязательно';
    if (isNaN(age) || age <= 0) newErrors.age = 'Возраст должен быть положительным числом';
    if (!email.includes('@') || !email.includes('.')) newErrors.email = 'Введите корректный email';
    if (!terms) newErrors.terms = 'Необходимо принять условия';

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
      password: '',
      country: '',
      avatar: '',
    });

    if (nameRef.current) nameRef.current.value = '';
    if (ageRef.current) ageRef.current.value = '';
    if (emailRef.current) emailRef.current.value = '';
    if (genderRef.current) genderRef.current.value = 'male';
    if (termsRef.current) termsRef.current.checked = false;

    setErrors({});
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="uncontrolled-name">Имя:</label>
        <input
          id="uncontrolled-name"
          type="text"
          ref={nameRef}
          defaultValue=""
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
      </div>

      <div>
        <label htmlFor="uncontrolled-age">Возраст:</label>
        <input
          id="uncontrolled-age"
          type="number"
          ref={ageRef}
          defaultValue=""
        />
        {errors.age && <span style={{ color: 'red' }}>{errors.age}</span>}
      </div>

      <div>
        <label htmlFor="uncontrolled-email">Email:</label>
        <input
          id="uncontrolled-email"
          type="email"
          ref={emailRef}
          defaultValue=""
        />
        {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
      </div>

      <div>
        <label htmlFor="uncontrolled-gender">Пол:</label>
        <select id="uncontrolled-gender" ref={genderRef} defaultValue="male">
          <option value="male">Мужской</option>
          <option value="female">Женский</option>
          <option value="other">Другой</option>
        </select>
      </div>

      <div>
        <label>
          <input type="checkbox" ref={termsRef} />
          Я принимаю условия
        </label>
        {errors.terms && <span style={{ color: 'red' }}>{errors.terms}</span>}
      </div>

      <button type="submit">Отправить</button>
    </form>
  );
};