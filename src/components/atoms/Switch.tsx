import styles from './Switch.module.css';

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  label: string;
}

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={[styles.switch, checked ? styles.on : ''].join(' ')}
    >
      <span className={styles.thumb} />
      <span className="sr-only">{label}</span>
    </button>
  );
}
