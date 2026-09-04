import { useAccessibility } from '../../hooks/useAccessibility';
import { IconButton } from '../atoms/IconButton';
import { COPY } from '../../constants/copy';
import styles from './AssistedModeButton.module.css';

/**
 * Botón compacto en el header (arriba a la derecha) que prende/apaga el
 * Modo Simple: navegación de a un recuerdo por vez con lectura en voz alta.
 */
export function AssistedModeButton() {
  const { settings, toggleAssistedMode } = useAccessibility();
  const { assistedMode } = settings;

  return (
    <IconButton
      label={assistedMode ? COPY.assisted.exit : COPY.assisted.enter}
      variant="solid"
      className={[styles.button, assistedMode ? styles.active : ''].join(' ')}
      onClick={toggleAssistedMode}
      aria-pressed={assistedMode}
    >
      <SpeakerIcon />
    </IconButton>
  );
}

function SpeakerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 9v6h4l5 4V5L8 9H4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="currentColor"
      />
      <path d="M17 8.5a5 5 0 010 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M19.5 6a9 9 0 010 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
