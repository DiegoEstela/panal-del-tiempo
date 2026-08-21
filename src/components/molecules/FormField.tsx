import type { ReactNode } from 'react';
import { Text } from '../atoms/Text';
import styles from './FormField.module.css';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
  error?: string;
}

export function FormField({ label, htmlFor, children, error }: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={htmlFor} className={styles.label}>
        <Text as="span" variant="caption" color="secondary">
          {label}
        </Text>
      </label>
      {children}
      {error && (
        <Text as="span" variant="caption" color="secondary" className={styles.error}>
          {error}
        </Text>
      )}
    </div>
  );
}
