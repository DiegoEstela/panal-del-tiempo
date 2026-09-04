import { useEffect, useMemo, useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { groupEventsByYear, sortEventsChronologically, formatMonthYear } from '../../utils/date';
import { useAccessibility } from '../../hooks/useAccessibility';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { EventCard } from '../molecules/EventCard';
import { DateFinder, type DateOption } from '../molecules/DateFinder';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { Text } from '../atoms/Text';
import styles from './TimelineList.module.css';

interface TimelineListProps {
  events: TimelineEvent[];
}

function monthAnchorId(year: number, month: number): string {
  return `panal-month-${year}-${month}`;
}

function yearAnchorId(year: number): string {
  return `panal-year-${year}`;
}

export function TimelineList({ events }: TimelineListProps) {
  const { settings } = useAccessibility();
  const { memberId } = useIdentity();
  const { deleteEvent } = useEvents();
  // Los años arrancan siempre colapsados: solo se ve el título con la
  // cantidad de recuerdos hasta que el usuario toca alguno.
  const [openYears, setOpenYears] = useState<Set<number>>(new Set());
  const [pendingScrollTarget, setPendingScrollTarget] = useState<string | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<TimelineEvent | null>(null);

  const groups = useMemo(() => groupEventsByYear(sortEventsChronologically(events)), [events]);

  const dateOptions = useMemo<DateOption[]>(() => {
    const map = new Map<string, DateOption>();
    for (const event of sortEventsChronologically(events)) {
      const key = `${event.year}-${event.month}`;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, { year: event.year, month: event.month, label: formatMonthYear(event.month, event.year), count: 1 });
      }
    }
    return Array.from(map.values());
  }, [events]);

  useEffect(() => {
    if (!pendingScrollTarget) return;
    const element = document.getElementById(pendingScrollTarget);
    element?.scrollIntoView({ behavior: settings.assistedMode ? 'auto' : 'smooth', block: 'start' });
    setPendingScrollTarget(null);
  }, [pendingScrollTarget, settings.assistedMode]);

  function toggleYear(year: number) {
    setOpenYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function handleDateSelect(option: DateOption) {
    setOpenYears((prev) => {
      if (prev.has(option.year)) return prev;
      const next = new Set(prev);
      next.add(option.year);
      return next;
    });
    setPendingScrollTarget(monthAnchorId(option.year, option.month));
  }

  if (events.length === 0) {
    return (
      <div className={styles.empty}>
        <Text color="secondary">{COPY.timeline.empty}</Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <DateFinder options={dateOptions} onSelect={handleDateSelect} />

      <div className={styles.yearList}>
        {groups.map(([year, yearEvents]) => {
          const isOpen = openYears.has(year);
          const seenMonths = new Set<number>();

          return (
            <section key={year} id={yearAnchorId(year)} className={styles.yearGroup}>
              <button
                type="button"
                className={styles.yearHeader}
                onClick={() => toggleYear(year)}
                aria-expanded={isOpen}
              >
                <Text as="span" variant="heading" className={styles.yearNumber}>
                  {year}
                </Text>
                <span className={styles.yearCount}>{yearEvents.length}</span>
                <ChevronIcon open={isOpen} />
              </button>

              {isOpen && (
                <ul className={styles.eventList}>
                  {yearEvents.map((event) => {
                    const isFirstOfMonth = !seenMonths.has(event.month);
                    seenMonths.add(event.month);
                    return (
                      <li key={event.id} id={isFirstOfMonth ? monthAnchorId(event.year, event.month) : undefined}>
                        <EventCard
                          event={event}
                          canDelete={event.createdBy === memberId}
                          onDelete={() => setDeletingEvent(event)}
                          showMonthTile={false}
                        />
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          );
        })}
      </div>

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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.chevron}
      style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
