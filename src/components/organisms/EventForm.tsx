import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import type { EventFormInput, TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { CURRENT_YEAR } from '../../constants/config';
import { resizeAndCompressImage } from '../../utils/image';
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
  const [photoURL, setPhotoURL] = useState(initialEvent?.photoURL);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialEvent);
  const isValid = title.trim().length > 0 && description.trim().length > 0;

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setProcessingPhoto(true);
    try {
      setPhotoURL(await resizeAndCompressImage(file));
    } finally {
      setProcessingPhoto(false);
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!isValid) return;
    setSubmitting(true);
    await onSubmit({ title: title.trim(), description: description.trim(), month, year, photoURL });
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

      <FormField label={COPY.eventForm.photoLabel}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className={styles.fileInput}
        />
        {photoURL && <img src={photoURL} alt="" className={styles.photoPreview} />}
        <div className={styles.photoActions}>
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={processingPhoto}>
            {processingPhoto ? COPY.eventForm.processingPhoto : photoURL ? COPY.eventForm.changePhoto : COPY.eventForm.addPhoto}
          </Button>
          {photoURL && (
            <Button type="button" variant="ghost" onClick={() => setPhotoURL(undefined)}>
              {COPY.eventForm.removePhoto}
            </Button>
          )}
        </div>
      </FormField>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onCancel}>
          {COPY.eventForm.cancel}
        </Button>
        <Button type="submit" disabled={!isValid || submitting || processingPhoto}>
          {COPY.eventForm.submit}
        </Button>
      </div>
    </form>
  );
}
