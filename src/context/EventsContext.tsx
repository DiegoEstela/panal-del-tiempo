import { createContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { TimelineEvent, EventFormInput, ValidationStatus } from '../types/event';
import type { MemberId } from '../types/member';
import { getEventsRepository } from '../services/repository';

interface EventsContextValue {
  events: TimelineEvent[];
  loading: boolean;
  createEvent: (input: EventFormInput, createdBy: MemberId) => Promise<void>;
  updateEvent: (event: TimelineEvent, input: EventFormInput) => Promise<void>;
  setValidation: (event: TimelineEvent, member: MemberId, status: ValidationStatus, comment?: string) => Promise<void>;
}

export const EventsContext = createContext<EventsContextValue | undefined>(undefined);

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const repository = useMemo(() => getEventsRepository(), []);

  useEffect(() => {
    const unsubscribe = repository.subscribe((next) => {
      setEvents(next);
      setLoading(false);
    });
    return unsubscribe;
  }, [repository]);

  const value = useMemo<EventsContextValue>(
    () => ({
      events,
      loading,
      createEvent: (input, createdBy) => repository.createEvent(input, createdBy),
      updateEvent: (event, input) => repository.updateEvent(event, input),
      setValidation: (event, member, status, comment) => repository.setValidation(event, member, status, comment),
    }),
    [events, loading, repository],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}
