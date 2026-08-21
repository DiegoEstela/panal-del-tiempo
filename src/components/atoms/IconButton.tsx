import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  variant?: 'solid' | 'soft';
}

export function IconButton({ label, children, variant = 'soft', className, ...rest }: IconButtonProps) {
  const classes = [styles.iconButton, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button className={classes} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}
