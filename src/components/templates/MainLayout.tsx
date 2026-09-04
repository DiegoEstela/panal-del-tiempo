import { useState, type ReactNode } from 'react';
import { AppHeader, type ViewKey } from '../organisms/AppHeader';
import { BottomNav } from '../organisms/BottomNav';
import { EventForm } from '../organisms/EventForm';
import { Modal } from '../molecules/Modal';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
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
      <AppHeader view={view} onChangeView={onChangeView} onAddEvent={() => setCreating(true)} />
      <main className={styles.main}>{children}</main>
      <BottomNav view={view} onChangeView={onChangeView} />

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
