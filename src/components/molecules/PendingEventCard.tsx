import type { ReactNode } from 'react';
import type { TimelineEvent } from '../../types/event';
import { MONTH_NAMES } from '../../constants/config';
import { COPY } from '../../constants/copy';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import { MemberAvatarGroup } from './MemberAvatarGroup';
import { CommentThread } from './CommentThread';
import styles from './PendingEventCard.module.css';

interface PendingEventCardProps {
  event: TimelineEvent;
  actions?: ReactNode;
  onListen?: () => void;
}

export function PendingEventCard({ event, actions, onListen }: PendingEventCardProps) {
  return (
    <li className={styles.card}>
      <div className={styles.header}>
        <div>
          <Text variant="subheading">{event.title}</Text>
          <Text variant="caption" color="secondary">
            {MONTH_NAMES[event.month - 1]} {event.year}
          </Text>
        </div>
        <MemberAvatarGroup validations={event.validations} createdBy={event.createdBy} />
      </div>
      {event.photoURL && <img src={event.photoURL} alt="" className={styles.photo} />}
      <Text color="secondary">{event.description}</Text>
      {onListen && (
        <Button variant="secondary" onClick={onListen}>
          🔊 {COPY.assisted.listen}
        </Button>
      )}
      {event.comments.length > 0 && <CommentThread comments={event.comments} />}
      {actions && <div className={styles.actions}>{actions}</div>}
    </li>
  );
}
