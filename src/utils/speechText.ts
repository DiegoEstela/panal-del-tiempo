import type { TimelineEvent } from '../types/event';
import { COPY } from '../constants/copy';
import { getMember } from '../constants/members';
import { formatMonthYear } from './date';

export function buildEventSpeechText(event: TimelineEvent): string {
  const creator = getMember(event.createdBy);
  return `${event.title}. ${formatMonthYear(event.month, event.year)}. ${event.description}. ${COPY.assisted.createdBy}: ${creator.name}.`;
}
