import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  doc,
  query,
  orderBy,
  runTransaction,
} from 'firebase/firestore';
import type { EventsRepository } from './EventsRepository';
import type { TimelineEvent, EventFormInput, ValidationStatus } from '../../types/event';
import type { MemberId } from '../../types/member';
import { getFirebaseFirestore } from '../firebase/firebaseClient';
import { MEMBER_IDS } from '../../constants/members';
import { createId } from '../../utils/id';
import { createInitialValidations, resetPeerValidations, isFullyValidated } from '../../utils/validation';

const COLLECTION_NAME = 'events';

/**
 * Implementación real: guarda cada evento como un documento en la
 * colección `events` de Firestore y escucha cambios en tiempo real
 * para que los 4 amigos vean el mismo estado sin importar el dispositivo.
 */
export function createFirestoreEventsRepository(): EventsRepository {
  const db = getFirebaseFirestore();
  const eventsCollection = collection(db, COLLECTION_NAME);

  return {
    subscribe(onChange) {
      const eventsQuery = query(eventsCollection, orderBy('createdAt', 'asc'));
      return onSnapshot(eventsQuery, (snapshot) => {
        const events = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }) as TimelineEvent);
        onChange(events);
      });
    },

    async createEvent(input: EventFormInput, createdBy: MemberId) {
      const now = Date.now();
      const newEvent: Omit<TimelineEvent, 'id'> = {
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
        ...(input.photoURL ? { photoURL: input.photoURL } : {}),
      };
      await addDoc(eventsCollection, newEvent);
    },

    async updateEvent(event: TimelineEvent, input: EventFormInput) {
      const photoUpdate = input.photoURL ? { photoURL: input.photoURL } : event.photoURL ? { photoURL: deleteField() } : {};
      await updateDoc(doc(db, COLLECTION_NAME, event.id), {
        title: input.title,
        description: input.description,
        month: input.month,
        year: input.year,
        updatedAt: Date.now(),
        validations: resetPeerValidations(event),
        ...photoUpdate,
      });
    },

    async setValidation(event: TimelineEvent, member: MemberId, status: ValidationStatus, comment?: string) {
      // Transacción: si dos personas validan casi al mismo tiempo, cada
      // escritura tiene que partir del estado más reciente del servidor
      // (no de la copia que tenga el cliente en memoria), para que la
      // segunda no pise el voto que acaba de guardar la primera.
      const ref = doc(db, COLLECTION_NAME, event.id);
      await runTransaction(db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        if (!snapshot.exists()) return;
        const current = snapshot.data() as Omit<TimelineEvent, 'id'>;
        const validations = { ...current.validations, [member]: status };
        const comments = comment
          ? [...current.comments, { id: createId(), author: member, text: comment, createdAt: Date.now() }]
          : current.comments;
        transaction.update(ref, {
          validations,
          comments,
          status: isFullyValidated(validations, current.createdBy) ? 'validated' : current.status,
        });
      });
    },

    async deleteEvent(event: TimelineEvent) {
      await deleteDoc(doc(db, COLLECTION_NAME, event.id));
    },
  };
}
