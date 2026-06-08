import { useState } from 'react';
import { PortalModal } from './components/PortalModal/PortalModal';
import { UncontrolledForm } from './components/UncontrolledForm/UncontrolledForm';
import { ReactHookForm } from './components/ReactHookForm/ReactHookForm';
import { SubmissionList } from './components/SubmissionList/SubmissionList';
import './App.css';

function App() {
  const [isUncontrolledOpen, setIsUncontrolledOpen] = useState(false);
  const [isRHFOpen, setIsRHFOpen] = useState(false);

  return (
    <div>
      <h1>React Forms</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setIsUncontrolledOpen(true)}>
          Открыть Uncontrolled форму
        </button>
        <button onClick={() => setIsRHFOpen(true)}>
          Открыть React Hook Form
        </button>
      </div>

      <h2>История отправленных форм</h2>
      <SubmissionList />

      <PortalModal
        isOpen={isUncontrolledOpen}
        onClose={() => setIsUncontrolledOpen(false)}
        ariaLabelledBy="uncontrolled-title"
      >
        <h2 id="uncontrolled-title">Uncontrolled форма</h2>
        <UncontrolledForm onSuccess={() => setIsUncontrolledOpen(false)} />
      </PortalModal>

      <PortalModal
        isOpen={isRHFOpen}
        onClose={() => setIsRHFOpen(false)}
        ariaLabelledBy="rhf-title"
      >
        <h2 id="rhf-title">React Hook Form</h2>
        <p>Здесь будет форма с RHF</p>
        <ReactHookForm onSuccess={() => setIsRHFOpen(false)} />
      </PortalModal>
    </div>
  );
}

export default App;
