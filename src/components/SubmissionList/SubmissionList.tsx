import { useFormStore } from '../../store/useFormStore';
import './SubmissionList.css';

export const SubmissionList = () => {
  const submissions = useFormStore((state) => state.submissions);

  if (submissions.length === 0) {
    return <p className="no-data">Нет отправленных форм</p>;
  }

  return (
    <div className="submissions-grid">
      {submissions.map((sub) => (
        <div key={sub.id} className="submission-card">
          {sub.avatar && (
            <img src={sub.avatar} alt="avatar" className="avatar" />
          )}
          <h3>{sub.name}</h3>
          <p><strong>Возраст:</strong> {sub.age}</p>
          <p><strong>Email:</strong> {sub.email}</p>
          <p><strong>Пол:</strong> {sub.gender === 'male' ? 'Мужской' : sub.gender === 'female' ? 'Женский' : 'Другой'}</p>
          <p><strong>Страна:</strong> {sub.country || '—'}</p>
          <p><strong>Условия приняты:</strong> {sub.terms ? 'Да' : 'Нет'}</p>
          <small>Отправлено: {new Date(sub.submittedAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
};