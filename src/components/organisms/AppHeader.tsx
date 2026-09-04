import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { isMineAndPending, isPendingForMember } from '../../utils/validation';
import { getMember } from '../../constants/members';
import { COPY } from '../../constants/copy';
import { Avatar } from '../atoms/Avatar';
import { IconButton } from '../atoms/IconButton';
import { Text } from '../atoms/Text';
import styles from './AppHeader.module.css';

export type ViewKey = 'home' | 'timeline' | 'pending';

interface AppHeaderProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
  onAddEvent: () => void;
}

export function AppHeader({ view, onChangeView, onAddEvent }: AppHeaderProps) {
  const { memberId } = useIdentity();
  const { events } = useEvents();

  const pendingCount = memberId
    ? events.filter((event) => isMineAndPending(event, memberId) || isPendingForMember(event, memberId)).length
    : 0;

  const currentMember = memberId ? getMember(memberId) : null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        {currentMember && <Avatar member={currentMember} size="sm" />}
        <Text as="h1" variant="subheading" className={styles.brandName}>
          {COPY.appName}
        </Text>
      </div>

      <div className={styles.actions}>
        <nav className={styles.nav}>
          <button
            type="button"
            className={[styles.tab, view === 'home' ? styles.active : ''].join(' ')}
            onClick={() => onChangeView('home')}
          >
            {COPY.nav.home}
          </button>
          <button
            type="button"
            className={[styles.tab, view === 'timeline' ? styles.active : ''].join(' ')}
            onClick={() => onChangeView('timeline')}
          >
            {COPY.nav.timeline}
          </button>
          <button
            type="button"
            className={[styles.tab, view === 'pending' ? styles.active : ''].join(' ')}
            onClick={() => onChangeView('pending')}
          >
            {COPY.nav.pending}
            {pendingCount > 0 && <span className={styles.count}>{pendingCount}</span>}
          </button>
        </nav>

        <IconButton label={COPY.addEvent} variant="solid" onClick={onAddEvent}>
          <PlusIcon />
        </IconButton>
      </div>
    </header>
  );
}

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}
