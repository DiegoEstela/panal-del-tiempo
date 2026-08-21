import type { ReactNode } from 'react';
import styles from './HexTile.module.css';

interface HexTileProps {
  children: ReactNode;
  tone?: 'primary' | 'accent' | 'neutral';
}

export function HexTile({ children, tone = 'primary' }: HexTileProps) {
  return <div className={[styles.hex, styles[tone]].join(' ')}>{children}</div>;
}
