import { useState } from 'react';
import { COPY } from '../../constants/copy';
import { Button } from '../atoms/Button';
import { TextArea } from '../atoms/TextArea';
import styles from './ValidationActions.module.css';

interface ValidationActionsProps {
  onValidate: () => void;
  onReview: (comment: string) => void;
}

export function ValidationActions({ onValidate, onReview }: ValidationActionsProps) {
  const [reviewing, setReviewing] = useState(false);
  const [comment, setComment] = useState('');

  function handleReview() {
    onReview(comment.trim());
    setComment('');
    setReviewing(false);
  }

  if (reviewing) {
    return (
      <div className={styles.reviewForm}>
        <TextArea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder={COPY.pending.reviewCommentPlaceholder}
          rows={2}
        />
        <div className={styles.reviewActions}>
          <Button variant="ghost" onClick={() => setReviewing(false)}>
            {COPY.eventForm.cancel}
          </Button>
          <Button variant="danger" disabled={!comment.trim()} onClick={handleReview}>
            {COPY.pending.review}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Button onClick={onValidate}>{COPY.pending.validate}</Button>
      <Button variant="danger" onClick={() => setReviewing(true)}>
        {COPY.pending.review}
      </Button>
    </>
  );
}
