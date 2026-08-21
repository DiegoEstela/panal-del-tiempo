import type { EventsRepository } from './EventsRepository';
import type { TimelineEvent, EventFormInput, ValidationStatus } from '../../types/event';
import type { MemberId } from '../../types/member';
import { LOCAL_EVENTS_STORAGE_KEY } from '../../constants/config';
import { MEMBER_IDS } from '../../constants/members';
import { createId } from '../../utils/id';
import { createInitialValidations, resetPeerValidations, isFullyValidated } from '../../utils/validation';

const LOCAL_CHANGE_EVENT = 'panal-local-events-changed';

function readEvents(): TimelineEvent[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TimelineEvent[]) : [];
  } catch {
    return [];
  }
}

function writeEvents(events: TimelineEvent[]) {
  localStorage.setItem(LOCAL_EVENTS_STORAGE_KEY, JSON.stringify(events));
  window.dispatchEvent(new CustomEvent(LOCAL_CHANGE_EVENT));
}

/**
 * Modo demo/desarrollo: guarda todo en localStorage y sincroniza entre
 * pestañas del mismo navegador vía el evento nativo `storage`. Útil para
 * probar la app completa sin necesitar credenciales reales de Firebase.
 */
export function createLocalEventsRepository(): EventsRepository {
  return {
    subscribe(onChange) {
      const emit = () => onChange(readEvents());
      emit();

      const handleStorage = (event: StorageEvent) => {
        if (event.key === LOCAL_EVENTS_STORAGE_KEY) emit();
      };
      window.addEventListener('storage', handleStorage);
      window.addEventListener(LOCAL_CHANGE_EVENT, emit);

      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener(LOCAL_CHANGE_EVENT, emit);
      };
    },

    async createEvent(input: EventFormInput, createdBy: MemberId) {
      const now = Date.now();
      const newEvent: TimelineEvent = {
        id: createId(),
        title: input.title,
        description: input.description,
        month: input.month,
        year: input.year,
        createdBy,
        createdAt: now,
        updatedAt: now,
        status: 'pending',
        validations: createInitialValidations(createdBy, MEMBER_IDS),
        comments: [],
      };
      writeEvents([...readEvents(), newEvent]);
    },

    async updateEvent(event: TimelineEvent, input: EventFormInput) {
      const events = readEvents().map((current) => {
        if (current.id !== event.id) return current;
        return {
          ...current,
          title: input.title,
          description: input.description,
          month: input.month,
          year: input.year,
          updatedAt: Date.now(),
          validations: resetPeerValidations(current),
        };
      });
      writeEvents(events);
    },

    async setValidation(event: TimelineEvent, member: MemberId, status: ValidationStatus, comment?: string) {
      const events = readEvents().map((current) => {
        if (current.id !== event.id) return current;
        const validations = { ...current.validations, [member]: status };
        const comments = comment
          ? [...current.comments, { id: createId(), author: member, text: comment, createdAt: Date.now() }]
          : current.comments;
        return {
          ...current,
          validations,
          comments,
          status: isFullyValidated(validations, current.createdBy) ? 'validated' as const : current.status,
        };
      });
      writeEvents(events);
    },
  };
}
