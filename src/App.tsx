import { useState } from 'react';
import { PortalModal } from './components/PortalModal/PortalModal';
import './App.css';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1>React Forms Task</h1>
      <button onClick={() => setIsModalOpen(true)}>Открыть форму</button>

      <PortalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ariaLabelledBy="modal-title"
      >
        <h2 id="modal-title">Тестовая форма</h2>
        <p>Здесь будет форма</p>
        <button onClick={() => setIsModalOpen(false)}>Закрыть</button>
      </PortalModal>
    </div>
  );
}

export default App;
