import { useMemo, useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../molecules/EventCard';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import styles from './OnThisDay.module.css';

interface OnThisDayProps {
  events: TimelineEvent[];
  onGoToTimeline: () => void;
}

const now = new Date();
const CURRENT_MONTH = now.getMonth() + 1;
const CURRENT_YEAR = now.getFullYear();

function yearsAgoLabel(year: number): string {
  if (year === CURRENT_YEAR) return COPY.home.thisMonth;
  const diff = CURRENT_YEAR - year;
  return `Hace ${diff} ${diff === 1 ? 'año' : 'años'}`;
}

export function OnThisDay({ events, onGoToTimeline }: OnThisDayProps) {
  const { memberId } = useIdentity();
  const { deleteEvent } = useEvents();
  const [deletingEvent, setDeletingEvent] = useState<TimelineEvent | null>(null);

  const matches = useMemo(
    () => events.filter((event) => event.month === CURRENT_MONTH).sort((a, b) => b.year - a.year),
    [events],
  );

  return (
    <div className={styles.wrapper}>
      <Text as="h1" variant="title" className={styles.title}>
        {COPY.home.title}
      </Text>

      {matches.length === 0 ? (
        <div className={styles.empty}>
          <Text color="secondary">{COPY.home.empty}</Text>
          <Button onClick={onGoToTimeline}>{COPY.home.ctaTimeline}</Button>
        </div>
      ) : (
        <ul className={styles.list}>
          {matches.map((event) => (
            <li key={event.id} className={styles.item}>
              <Text as="p" variant="caption" color="secondary" className={styles.yearLabel}>
                {yearsAgoLabel(event.year)}
              </Text>
              <EventCard
                event={event}
                canDelete={event.createdBy === memberId}
                onDelete={() => setDeletingEvent(event)}
                showMonthTile={false}
              />
            </li>
          ))}
        </ul>
      )}

      {deletingEvent && (
        <ConfirmDialog
          title={COPY.confirmDelete.title}
          message={COPY.confirmDelete.message}
          confirmLabel={COPY.confirmDelete.confirm}
          cancelLabel={COPY.eventForm.cancel}
          onCancel={() => setDeletingEvent(null)}
          onConfirm={async () => {
            try {
              await deleteEvent(deletingEvent);
            } finally {
              setDeletingEvent(null);
            }
          }}
        />
      )}
    </div>
  );
}
