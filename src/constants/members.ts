import type { Member, MemberId } from '../types/member';

export const MEMBERS: Member[] = [
  { id: 'diego', name: 'Diego', initials: 'DI', colorAccent: 'var(--color-member-diego)' },
  { id: 'julian', name: 'Julian', initials: 'JU', colorAccent: 'var(--color-member-julian)' },
  { id: 'lucas', name: 'Lucas', initials: 'LU', colorAccent: 'var(--color-member-lucas)' },
  { id: 'lautaro', name: 'Lautaro', initials: 'LA', colorAccent: 'var(--color-member-lautaro)' },
];

export const MEMBER_IDS: MemberId[] = MEMBERS.map((member) => member.id);

export function getMember(id: MemberId): Member {
  const member = MEMBERS.find((m) => m.id === id);
  if (!member) throw new Error(`Miembro desconocido: ${id}`);
  return member;
}
