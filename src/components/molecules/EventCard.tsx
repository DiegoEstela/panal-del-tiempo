import { useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { MONTH_NAMES } from '../../constants/config';
import { getMember } from '../../constants/members';
import { HexTile } from '../atoms/HexTile';
import { Text } from '../atoms/Text';
import { Avatar } from '../atoms/Avatar';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: TimelineEvent;
}

export function EventCard({ event }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const creator = getMember(event.createdBy);

  return (
    <article className={styles.card}>
      <button type="button" className={styles.trigger} onClick={() => setExpanded((prev) => !prev)} aria-expanded={expanded}>
        <HexTile tone="primary">{MONTH_NAMES[event.month - 1].slice(0, 3)}</HexTile>
        <div className={styles.content}>
          <Text variant="subheading">{event.title}</Text>
          <Text variant="caption" color="secondary">
            {MONTH_NAMES[event.month - 1]} {event.year}
          </Text>
        </div>
        <Avatar member={creator} size="sm" />
      </button>
      {expanded && (
        <div className={styles.details}>
          <Text color="secondary">{event.description}</Text>
        </div>
      )}
    </article>
  );
}
