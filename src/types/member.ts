export type MemberId = 'diego' | 'julian' | 'lucas' | 'lautaro';

export interface Member {
  id: MemberId;
  name: string;
  initials: string;
  colorAccent: string;
  photoURL?: string; // Version 2: foto de perfil
}
