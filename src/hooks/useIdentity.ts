import { useContext } from 'react';
import { IdentityContext } from '../context/IdentityContext';

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (!context) throw new Error('useIdentity debe usarse dentro de IdentityProvider');
  return context;
}
