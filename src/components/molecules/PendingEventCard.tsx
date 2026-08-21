import type { ReactNode } from 'react';
import type { TimelineEvent } from '../../types/event';
import { MONTH_NAMES } from '../../constants/config';
import { Text } from '../atoms/Text';
import { MemberAvatarGroup } from './MemberAvatarGroup';
import { CommentThread } from './CommentThread';
import styles from './PendingEventCard.module.css';

interface PendingEventCardProps {
  event: TimelineEvent;
  actions?: ReactNode;
}

export function PendingEventCard({ event, actions }: PendingEventCardProps) {
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
      <Text color="secondary">{event.description}</Text>
      {event.comments.length > 0 && <CommentThread comments={event.comments} />}
      {actions && <div className={styles.actions}>{actions}</div>}
    </li>
  );
}
