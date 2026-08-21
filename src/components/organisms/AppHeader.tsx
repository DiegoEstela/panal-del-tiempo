import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { isMineAndPending, isPendingForMember } from '../../utils/validation';
import { getMember } from '../../constants/members';
import { COPY } from '../../constants/copy';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import styles from './AppHeader.module.css';

export type ViewKey = 'timeline' | 'pending';

interface AppHeaderProps {
  view: ViewKey;
  onChangeView: (view: ViewKey) => void;
}

export function AppHeader({ view, onChangeView }: AppHeaderProps) {
  const { memberId } = useIdentity();
  const { events } = useEvents();

  const pendingCount = memberId
    ? events.filter((event) => isMineAndPending(event, memberId) || isPendingForMember(event, memberId)).length
    : 0;

  const currentMember = memberId ? getMember(memberId) : null;

  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.hexLogo} aria-hidden="true" />
        <Text as="h1" variant="subheading" className={styles.brandName}>
          {COPY.appName}
        </Text>
      </div>

      <nav className={styles.nav}>
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

      {currentMember && <Avatar member={currentMember} size="sm" />}
    </header>
  );
}
