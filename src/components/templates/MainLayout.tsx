import { useState, type ReactNode } from 'react';
import { AppHeader, type ViewKey } from '../organisms/AppHeader';
import { BottomNav } from '../organisms/BottomNav';
import { AccessibilityPanel } from '../organisms/AccessibilityPanel';
import { EventForm } from '../organisms/EventForm';
import { Modal } from '../molecules/Modal';
import { IconButton } from '../atoms/IconButton';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { COPY } from '../../constants/copy';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
  children: ReactNode;
}

export function MainLayout({ view, onChangeView, children }: MainLayoutProps) {
  const [creating, setCreating] = useState(false);
  const { memberId } = useIdentity();
  const { createEvent } = useEvents();

  return (
    <div className={styles.layout}>
      <AppHeader view={view} onChangeView={onChangeView} />
      <main className={styles.main}>{children}</main>
      <BottomNav view={view} onChangeView={onChangeView} />
      <AccessibilityPanel />

      <IconButton label={COPY.addEvent} variant="solid" className={styles.fab} onClick={() => setCreating(true)}>
        <PlusIcon />
      </IconButton>

      {creating && memberId && (
        <Modal onClose={() => setCreating(false)} labelledBy="new-event-title">
          <EventForm
            onCancel={() => setCreating(false)}
            onSubmit={async (input) => {
              await createEvent(input, memberId);
              setCreating(false);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
