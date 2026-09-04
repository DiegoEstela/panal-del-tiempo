import { useEffect, useMemo, useState } from 'react';
import type { TimelineEvent } from '../../types/event';
import { COPY } from '../../constants/copy';
import { sortEventsChronologically } from '../../utils/date';
import { buildEventSpeechText } from '../../utils/speechText';
import { useSpeech } from '../../hooks/useSpeech';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import styles from './AssistedTimeline.module.css';

interface AssistedTimelineProps {
  events: TimelineEvent[];
}

export function AssistedTimeline({ events }: AssistedTimelineProps) {
  const sorted = useMemo(() => sortEventsChronologically(events), [events]);
  const [index, setIndex] = useState(() => Math.max(sorted.length - 1, 0));
  const { speak, stop, speaking } = useSpeech();

  useEffect(() => {
    setIndex((prev) => Math.min(prev, Math.max(sorted.length - 1, 0)));
  }, [sorted.length]);

  const current = sorted[index];

  useEffect(() => {
    if (!current) return;
    speak(buildEventSpeechText(current));
    // Al pasar a otro recuerdo (Anterior/Siguiente) esto corta lo que se
    // estuviera narrando y arranca el relato del nuevo automáticamente.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  if (!current) {
    return (
      <div className={styles.empty}>
        <Text variant="subheading" color="secondary">
          {COPY.timeline.empty}
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <Text as="p" variant="subheading" color="secondary" className={styles.position}>
        {index + 1} / {sorted.length}
      </Text>

      <div className={styles.card}>
        <Text as="h2" variant="title" className={styles.title}>
          {current.title}
        </Text>

        <Button
          variant="secondary"
          fullWidth
          onClick={() => (speaking ? stop() : speak(buildEventSpeechText(current)))}
          className={[styles.listenButton, speaking ? styles.listening : ''].join(' ')}
        >
          {speaking ? `⏹ ${COPY.assisted.stop}` : `🔊 ${COPY.assisted.listen}`}
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
