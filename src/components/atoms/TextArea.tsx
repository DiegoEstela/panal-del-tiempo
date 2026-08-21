import type { TextareaHTMLAttributes } from 'react';
import styles from './TextArea.module.css';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ className, rows = 4, ...rest }: TextAreaProps) {
  return <textarea rows={rows} className={[styles.textarea, className].filter(Boolean).join(' ')} {...rest} />;
}
