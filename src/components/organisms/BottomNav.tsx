import { COPY } from '../../constants/copy';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { isMineAndPending, isPendingForMember } from '../../utils/validation';
import type { ViewKey } from './AppHeader';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
}

export function BottomNav({ view, onChangeView }: BottomNavProps) {
  const { memberId } = useIdentity();
  const { events } = useEvents();

  const pendingCount = memberId
    ? events.filter((event) => isMineAndPending(event, memberId) || isPendingForMember(event, memberId)).length
    : 0;

  return (
    <nav className={styles.bar}>
      <button
        type="button"
        className={[styles.tab, view === 'timeline' ? styles.active : ''].join(' ')}
        onClick={() => onChangeView('timeline')}
      >
        <TimelineIcon />
        <span>{COPY.nav.timeline}</span>
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
  );
}

function TimelineIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12h16M4 6h10M4 18h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
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
