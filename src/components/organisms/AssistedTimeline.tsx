import { useEffect, useMemo, useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { formatMonthYear, sortEventsChronologically } from '../../utils/date';
import { getMember } from '../../constants/members';
import { buildEventSpeechText } from '../../utils/speechText';
import { useSpeech } from '../../hooks/useSpeech';
import { Avatar } from '../atoms/Avatar';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import styles from './AssistedTimeline.module.css';

interface AssistedTimelineProps {
  events: TimelineEvent[];
}

export function AssistedTimeline({ events }: AssistedTimelineProps) {
  const sorted = useMemo(() => sortEventsChronologically(events), [events]);
  const [index, setIndex] = useState(() => Math.max(sorted.length - 1, 0));
  const { speak } = useSpeech();

  useEffect(() => {
    setIndex((prev) => Math.min(prev, Math.max(sorted.length - 1, 0)));
  }, [sorted.length]);

  const current = sorted[index];

  useEffect(() => {
    if (!current) return;
    speak(buildEventSpeechText(current));
  }, [current, speak]);

  if (!current) {
    return (
      <div className={styles.empty}>
        <Text variant="subheading" color="secondary">
          {COPY.timeline.empty}
        </Text>
      </div>
    );
  }

  const creator = getMember(current.createdBy);

  return (
    <div className={styles.wrapper}>
      <Text as="p" variant="subheading" color="secondary" className={styles.position}>
        {index + 1} / {sorted.length}
      </Text>

      <div className={styles.card}>
        {current.photoURL && <img src={current.photoURL} alt="" className={styles.photo} />}
        <Avatar member={creator} size="lg" />
        <Text as="h2" variant="title" className={styles.title}>
          {current.title}
        </Text>
        <Text variant="subheading" color="secondary">
          {formatMonthYear(current.month, current.year)}
        </Text>
        <Text className={styles.description}>{current.description}</Text>
        <Text variant="subheading" color="secondary">
          {COPY.assisted.createdBy}: {creator.name}
        </Text>

        <Button variant="secondary" fullWidth onClick={() => speak(buildEventSpeechText(current))} className={styles.listenButton}>
          🔊 {COPY.assisted.listen}
        </Button>
      </div>

      <div className={styles.nav}>
        <Button
          variant="ghost"
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className={styles.navButton}
        >
          ◀ {COPY.assisted.prev}
        </Button>
        <Button
          onClick={() => setIndex((i) => Math.min(i + 1, sorted.length - 1))}
          disabled={index === sorted.length - 1}
          className={styles.navButton}
        >
          {COPY.assisted.next} ▶
        </Button>
      </div>
    </div>
  );
}
