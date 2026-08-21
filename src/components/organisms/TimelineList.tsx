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

type Row =
  | { kind: 'year'; year: number; count: number; anchorId: string }
  | { kind: 'event'; event: TimelineEvent; anchorId?: string };

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
  const [collapsedYears, setCollapsedYears] = useState<Set<number>>(new Set());
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

  const rows = useMemo<Row[]>(() => {
    const seenMonths = new Set<string>();
    return groups.flatMap(([year, yearEvents]) => {
      const yearRow: Row = { kind: 'year', year, count: yearEvents.length, anchorId: yearAnchorId(year) };
      if (collapsedYears.has(year)) return [yearRow];

      const eventRows: Row[] = yearEvents.map((event) => {
        const monthKey = `${event.year}-${event.month}`;
        const isFirstOfMonth = !seenMonths.has(monthKey);
        seenMonths.add(monthKey);
        return { kind: 'event', event, anchorId: isFirstOfMonth ? monthAnchorId(event.year, event.month) : undefined };
      });
      return [yearRow, ...eventRows];
    });
  }, [groups, collapsedYears]);

  useEffect(() => {
    if (!pendingScrollTarget) return;
    const element = document.getElementById(pendingScrollTarget);
    element?.scrollIntoView({ behavior: settings.reduceMotion ? 'auto' : 'smooth', block: 'start' });
    setPendingScrollTarget(null);
  }, [pendingScrollTarget, settings.reduceMotion]);

  function toggleYear(year: number) {
    setCollapsedYears((prev) => {
      const next = new Set(prev);
      if (next.has(year)) next.delete(year);
      else next.add(year);
      return next;
    });
  }

  function handleDateSelect(option: DateOption) {
    setCollapsedYears((prev) => {
      if (!prev.has(option.year)) return prev;
      const next = new Set(prev);
      next.delete(option.year);
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

      <ol className={styles.timeline}>
        {rows.map((row, index) => {
          const isFirst = index === 0;
          const isLast = index === rows.length - 1;
          const railClasses = [styles.rail, isFirst && styles.railFirst, isLast && styles.railLast]
            .filter(Boolean)
            .join(' ');

          if (row.kind === 'year') {
            const collapsed = collapsedYears.has(row.year);
            return (
              <li key={`year-${row.year}`} id={row.anchorId} className={styles.row}>
                <div className={railClasses}>
                  <span className={styles.yearNode} />
                </div>
                <button
                  type="button"
                  className={styles.yearHeader}
                  onClick={() => toggleYear(row.year)}
                  aria-expanded={!collapsed}
                >
                  <Text as="span" variant="heading">
                    {row.year}
                  </Text>
                  <span className={styles.yearCount}>{row.count}</span>
                  <ChevronIcon collapsed={collapsed} />
                </button>
              </li>
            );
          }

          return (
            <li key={row.event.id} id={row.anchorId} className={styles.row}>
              <div className={railClasses}>
                <span className={styles.eventNode} />
              </div>
              <div className={styles.eventContent}>
                <EventCard
                  event={row.event}
                  canDelete={row.event.createdBy === memberId}
                  onDelete={() => setDeletingEvent(row.event)}
                />
              </div>
            </li>
          );
        })}
      </ol>

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

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={styles.chevron}
      style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}
    >
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
