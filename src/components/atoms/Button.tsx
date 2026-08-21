import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', fullWidth, className, children, ...rest }: ButtonProps) {
  const classes = [styles.button, styles[variant], fullWidth ? styles.fullWidth : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
