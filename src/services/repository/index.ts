import type { EventsRepository } from './EventsRepository';
import { createLocalEventsRepository } from './localEventsRepository';
import { createFirestoreEventsRepository } from './firestoreEventsRepository';
import { isFirebaseConfigured } from '../firebase/firebaseClient';

let repository: EventsRepository | undefined;

/**
 * Elige automáticamente Firestore si hay credenciales en .env.local,
 * o el modo local/demo (localStorage) si todavía no se configuró Firebase.
 */
export function getEventsRepository(): EventsRepository {
  if (!repository) {
    repository = isFirebaseConfigured() ? createFirestoreEventsRepository() : createLocalEventsRepository();
  }
  return repository;
}
