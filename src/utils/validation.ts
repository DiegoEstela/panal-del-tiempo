import type { TimelineEvent, ValidationStatus } from '../types/event';
import type { MemberId } from '../types/member';

export function createInitialValidations(
  createdBy: MemberId,
  allMemberIds: MemberId[],
): Record<MemberId, ValidationStatus> {
  const validations = {} as Record<MemberId, ValidationStatus>;
  for (const id of allMemberIds) {
    validations[id] = id === createdBy ? 'validated' : 'pending';
  }
  return validations;
}

export function resetPeerValidations(event: TimelineEvent): Record<MemberId, ValidationStatus> {
  const validations = { ...event.validations };
  (Object.keys(validations) as MemberId[]).forEach((id) => {
    if (id !== event.createdBy) validations[id] = 'pending';
  });
  return validations;
}

export function isFullyValidated(
  validations: Record<MemberId, ValidationStatus>,
  createdBy: MemberId,
): boolean {
  return (Object.keys(validations) as MemberId[])
    .filter((id) => id !== createdBy)
    .every((id) => validations[id] === 'validated');
}

export function isPendingForMember(event: TimelineEvent, memberId: MemberId): boolean {
  return event.status === 'pending' && event.createdBy !== memberId && event.validations[memberId] !== 'validated';
}

export function isMineAndPending(event: TimelineEvent, memberId: MemberId): boolean {
  return event.status === 'pending' && event.createdBy === memberId;
}
