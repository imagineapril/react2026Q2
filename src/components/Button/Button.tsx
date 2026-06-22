import styles from './Button.module.css';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

const Button =({onClick, children, type = 'button', disabled = false}: ButtonProps) => {
  return (
    <button 
      className={styles.button} 
      onClick={onClick} 
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;