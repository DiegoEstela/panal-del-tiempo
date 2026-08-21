import { useState } from 'react';
import { useAccessibility } from '../../hooks/useAccessibility';
import type { AccessibilitySettings } from '../../context/AccessibilityContext';
import { COPY } from '../../constants/copy';
import { IconButton } from '../atoms/IconButton';
import { Switch } from '../atoms/Switch';
import { Text } from '../atoms/Text';
import { Modal } from '../molecules/Modal';
import styles from './AccessibilityPanel.module.css';

const OPTIONS: { key: keyof AccessibilitySettings; label: string }[] = [
  { key: 'largeText', label: COPY.accessibility.largeText },
  { key: 'highContrast', label: COPY.accessibility.highContrast },
  { key: 'reduceMotion', label: COPY.accessibility.reduceMotion },
  { key: 'simplified', label: COPY.accessibility.simplified },
];

export function AccessibilityPanel() {
  const [open, setOpen] = useState(false);
  const { settings, toggle } = useAccessibility();

  return (
    <>
      <IconButton label={COPY.accessibility.panelTitle} variant="solid" className={styles.trigger} onClick={() => setOpen(true)}>
        <AccessibilityIcon />
      </IconButton>

      {open && (
        <Modal onClose={() => setOpen(false)} labelledBy="accessibility-title">
          <div className={styles.panel}>
            <Text as="h2" id="accessibility-title" variant="heading">
              {COPY.accessibility.panelTitle}
            </Text>
            <ul className={styles.list}>
              {OPTIONS.map((option) => (
                <li key={option.key} className={styles.row}>
                  <Text variant="subheading">{option.label}</Text>
                  <Switch checked={settings[option.key]} onChange={() => toggle(option.key)} label={option.label} />
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </>
  );
}

function AccessibilityIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8a1.4 1.4 0 100-2.8 1.4 1.4 0 000 2.8zM7 10l5 1 5-1M12 11v4l-2.5 4M12 15l2.5 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
