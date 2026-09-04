import { COPY } from '../../constants/copy';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { isMineAndPending, isPendingForMember } from '../../utils/validation';
import type { ViewKey } from './AppHeader';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
  onAddEvent: () => void;
}

export function BottomNav({ view, onChangeView, onAddEvent }: BottomNavProps) {
  const { memberId } = useIdentity();
  const { events } = useEvents();

  const pendingCount = memberId
    ? events.filter((event) => isMineAndPending(event, memberId) || isPendingForMember(event, memberId)).length
    : 0;

  return (
    <div className={styles.wrapper}>
      <nav className={styles.bar}>
        <button
          type="button"
          className={[styles.tab, view === 'home' ? styles.active : ''].join(' ')}
          onClick={() => onChangeView('home')}
        >
          <HomeIcon />
          <span>{COPY.nav.home}</span>
        </button>
        <button
          type="button"
          className={[styles.tab, styles.tabTimeline, view === 'timeline' ? styles.active : ''].join(' ')}
          onClick={() => onChangeView('timeline')}
        >
          <span className={styles.timelineLabel}>{COPY.nav.timeline}</span>
        </button>
        <button
          type="button"
          className={[styles.tab, view === 'pending' ? styles.active : ''].join(' ')}
          onClick={() => onChangeView('pending')}
        >
          <PendingIcon />
          <span>{COPY.nav.pending}</span>
          {pendingCount > 0 && <span className={styles.count}>{pendingCount}</span>}
        </button>
      </nav>

      <div className={styles.addHalo}>
        <button type="button" className={styles.addButton} onClick={onAddEvent} aria-label={COPY.addEvent}>
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11l8-7 8 7v8a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-8z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function PendingIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
