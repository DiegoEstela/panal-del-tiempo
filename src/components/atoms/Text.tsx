import type { ElementType, ReactNode, HTMLAttributes } from 'react';
import styles from './Text.module.css';

type TextVariant = 'title' | 'heading' | 'subheading' | 'body' | 'caption';
type TextColorName = 'primary' | 'secondary' | 'inherit';

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
  color?: TextColorName;
  children: ReactNode;
}

export function Text({
  as: Component = 'p',
  variant = 'body',
  color = 'primary',
  children,
  className,
  ...rest
}: TextProps) {
  const classes = [styles[variant], styles[`color-${color}`], className].filter(Boolean).join(' ');
  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
