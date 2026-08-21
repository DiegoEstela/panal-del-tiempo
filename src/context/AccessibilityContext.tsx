import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ACCESSIBILITY_STORAGE_KEY } from '../constants/config';

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  simplified: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  simplified: false,
};

interface AccessibilityContextValue {
  settings: AccessibilitySettings;
  toggle: (key: keyof AccessibilitySettings) => void;
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
    root.dataset.textSize = settings.largeText ? 'large' : 'base';
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    root.dataset.motion = settings.reduceMotion ? 'reduce' : 'normal';
    root.dataset.density = settings.simplified ? 'simplified' : 'normal';
  }, [settings]);

  const toggle = useCallback((key: keyof AccessibilitySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const value = useMemo(() => ({ settings, toggle }), [settings, toggle]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}
