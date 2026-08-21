import { useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { useIdentity } from '../../hooks/useIdentity';
import { useEvents } from '../../hooks/useEvents';
import { isMineAndPending, isPendingForMember } from '../../utils/validation';
import { COPY } from '../../constants/copy';
import { PendingEventCard } from '../molecules/PendingEventCard';
import { ConfirmDialog } from '../molecules/ConfirmDialog';
import { ValidationActions } from './ValidationActions';
import { EventForm } from './EventForm';
import { Modal } from '../molecules/Modal';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import styles from './PendingList.module.css';

export function PendingList() {
  const { memberId } = useIdentity();
  const { events, updateEvent, setValidation, deleteEvent } = useEvents();
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<TimelineEvent | null>(null);

  if (!memberId) return null;

  const mine = events.filter((event) => isMineAndPending(event, memberId));
  const toValidate = events.filter((event) => isPendingForMember(event, memberId));

  return (
    <div className={styles.wrapper}>
      <section className={styles.section}>
        <Text as="h2" variant="heading">
          {COPY.pending.mineTitle}
        </Text>
        {mine.length === 0 ? (
          <Text color="secondary">{COPY.pending.mineEmpty}</Text>
        ) : (
          <ul className={styles.list}>
            {mine.map((event) => (
              <PendingEventCard
                key={event.id}
                event={event}
                actions={
                  <>
                    <Button variant="ghost" onClick={() => setEditingEvent(event)}>
                      {COPY.pending.edit}
                    </Button>
                    <Button variant="danger" onClick={() => setDeletingEvent(event)}>
                      {COPY.pending.delete}
                    </Button>
                  </>
                }
              />
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <Text as="h2" variant="heading">
          {COPY.pending.toValidateTitle}
        </Text>
        {toValidate.length === 0 ? (
          <Text color="secondary">{COPY.pending.toValidateEmpty}</Text>
        ) : (
          <ul className={styles.list}>
            {toValidate.map((event) => (
              <PendingEventCard
                key={event.id}
                event={event}
                actions={
                  <ValidationActions
                    onValidate={() => setValidation(event, memberId, 'validated')}
                    onReview={(comment) => setValidation(event, memberId, 'review', comment)}
                  />
                }
              />
            ))}
          </ul>
        )}
      </section>

      {editingEvent && (
        <Modal onClose={() => setEditingEvent(null)} labelledBy="edit-event-title">
          <EventForm
            initialEvent={editingEvent}
            onCancel={() => setEditingEvent(null)}
            onSubmit={async (input) => {
              await updateEvent(editingEvent, input);
              setEditingEvent(null);
            }}
          />
        </Modal>
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
