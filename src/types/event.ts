import type { MemberId } from './member';

export type ValidationStatus = 'pending' | 'validated' | 'review';

export type EventStatus = 'pending' | 'validated';

export interface EventComment {
  id: string;
  author: MemberId;
  text: string;
  createdAt: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  month: number; // 1-12
  year: number;
  photoURL?: string; // Version 2: foto del evento
  createdBy: MemberId;
  createdAt: number;
  updatedAt: number;
  status: EventStatus;
  validations: Record<MemberId, ValidationStatus>;
  comments: EventComment[];
}

export interface EventFormInput {
  title: string;
  description: string;
  month: number;
  year: number;
}
