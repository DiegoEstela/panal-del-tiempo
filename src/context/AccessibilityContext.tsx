import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACCESSIBILITY_STORAGE_KEY } from '../constants/config';

export interface AccessibilitySettings {
  assistedMode: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  assistedMode: false,
};

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  toggleAssistedMode: () => void;
}

export const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined);

function readStoredSettings(): AccessibilitySettings {
  try {
    const raw = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(readStoredSettings);

  useEffect(() => {
    localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
    const root = document.documentElement;
    const on = settings.assistedMode;
    root.dataset.textSize = on ? 'large' : 'base';
    root.dataset.contrast = on ? 'high' : 'normal';
    root.dataset.motion = on ? 'reduce' : 'normal';
    root.dataset.density = on ? 'simplified' : 'normal';
  }, [settings]);

  const toggleAssistedMode = useCallback(() => {
    setSettings((prev) => ({ ...prev, assistedMode: !prev.assistedMode }));
  }, []);

  const value = useMemo(() => ({ settings, toggleAssistedMode }), [settings, toggleAssistedMode]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
