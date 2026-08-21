import { useState, type FormEvent } from 'react';
import type { EventFormInput, TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { CURRENT_YEAR } from '../../constants/config';
import { FormField } from '../molecules/FormField';
import { MonthYearPicker } from '../molecules/MonthYearPicker';
import { TextField } from '../atoms/TextField';
import { TextArea } from '../atoms/TextArea';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import styles from './EventForm.module.css';

interface EventFormProps {
  initialEvent?: TimelineEvent;
  onSubmit: (input: EventFormInput) => Promise<void> | void;
  onCancel: () => void;
}

export function EventForm({ initialEvent, onSubmit, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(initialEvent?.title ?? '');
  const [description, setDescription] = useState(initialEvent?.description ?? '');
  const [month, setMonth] = useState(initialEvent?.month ?? new Date().getMonth() + 1);
  const [year, setYear] = useState(initialEvent?.year ?? CURRENT_YEAR);
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialEvent);
  const isValid = title.trim().length > 0 && description.trim().length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    await onSubmit({ title: title.trim(), description: description.trim(), month, year });
    setSubmitting(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Text as="h2" variant="heading">
        {isEditing ? COPY.eventForm.editTitle : COPY.eventForm.createTitle}
      </Text>

      <FormField label={COPY.eventForm.titleLabel} htmlFor="event-title">
        <TextField
          id="event-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder={COPY.eventForm.titlePlaceholder}
          required
        />
      </FormField>

      <FormField label={COPY.eventForm.descriptionLabel} htmlFor="event-description">
        <TextArea
          id="event-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={COPY.eventForm.descriptionPlaceholder}
          required
        />
      </FormField>

      <FormField label={`${COPY.eventForm.monthLabel} / ${COPY.eventForm.yearLabel}`}>
        <MonthYearPicker month={month} year={year} onChangeMonth={setMonth} onChangeYear={setYear} />
      </FormField>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {COPY.eventForm.cancel}
        </Button>
        <Button type="submit" disabled={!isValid || submitting}>
          {COPY.eventForm.submit}
        </Button>
      </div>
    </form>
  );
}
