import { useFormStore } from '../../store/useFormStore';
import { useEffect, useState } from 'react';
import './SubmissionList.css';

export const SubmissionList = () => {
  const submissions = useFormStore((state) => state.submissions);
  const [newItemId, setNewItemId] = useState<string | null>(null);

  useEffect(() => {
    if (submissions.length === 0) return;
    const lastId = submissions[submissions.length - 1].id;
    setTimeout(() => setNewItemId(lastId), 0);
    const timer = setTimeout(() => setNewItemId(null), 3000);
    return () => clearTimeout(timer);
  }, [submissions]);

  if (submissions.length === 0) {
    return <p className="no-data">Нет отправленных форм</p>;
  }

  return (
    <div className="submissions-grid">
      {submissions.map((sub) => (
        <div key={sub.id} className={`submission-card ${newItemId === sub.id ? 'new-submission' : ''}`}>
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