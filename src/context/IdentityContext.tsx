import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import type { MemberId } from '../types/member';
import { IDENTITY_STORAGE_KEY } from '../constants/config';
import { MEMBER_IDS } from '../constants/members';

interface IdentityContextValue {
  memberId: MemberId | null;
  setMemberId: (id: MemberId) => void;
}

export const IdentityContext = createContext<IdentityContextValue | undefined>(undefined);

function readStoredMemberId(): MemberId | null {
  const stored = localStorage.getItem(IDENTITY_STORAGE_KEY);
  return stored && (MEMBER_IDS as string[]).includes(stored) ? (stored as MemberId) : null;
}

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [memberId, setMemberIdState] = useState<MemberId | null>(readStoredMemberId);

  const setMemberId = useCallback((id: MemberId) => {
    localStorage.setItem(IDENTITY_STORAGE_KEY, id);
    setMemberIdState(id);
  }, []);

  const value = useMemo(() => ({ memberId, setMemberId }), [memberId, setMemberId]);

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}
