import { useState, type ReactNode } from 'react';
import { AppHeader, type ViewKey } from '../organisms/AppHeader';
import { BottomNav } from '../organisms/BottomNav';
import { EventForm } from '../organisms/EventForm';
import { Modal } from '../molecules/Modal';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { useAccessibility } from '../../hooks/useAccessibility';
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
  const { settings } = useAccessibility();
  const openCreate = () => setCreating(true);

  return (
    <div className={styles.layout}>
      <AppHeader view={view} onChangeView={onChangeView} onAddEvent={openCreate} />
      <main className={[styles.main, settings.assistedMode ? styles.mainNoFooter : ''].join(' ')}>{children}</main>
      {/* En Modo Simple solo se ve la línea de tiempo, sin la barra de abajo. */}
      {!settings.assistedMode && <BottomNav view={view} onChangeView={onChangeView} onAddEvent={openCreate} />}

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
