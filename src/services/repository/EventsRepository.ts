import type { TimelineEvent, EventFormInput, ValidationStatus } from '../../types/event';
import type { MemberId } from '../../types/member';

export interface EventsRepository {
  subscribe(onChange: (events: TimelineEvent[]) => void): () => void;
  createEvent(input: EventFormInput, createdBy: MemberId): Promise<void>;
  updateEvent(event: TimelineEvent, input: EventFormInput): Promise<void>;
  setValidation(event: TimelineEvent, member: MemberId, status: ValidationStatus, comment?: string): Promise<void>;
}
