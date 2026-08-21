import type { ReactNode } from 'react';
import styles from './Modal.module.css';

interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  labelledBy?: string;
}

export function Modal({ children, onClose, labelledBy }: ModalProps) {
  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onClick={onClose ? () => onClose() : undefined}
    >
      <div className={styles.panel} onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
