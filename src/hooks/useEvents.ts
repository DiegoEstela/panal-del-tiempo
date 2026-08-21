import { useContext } from 'react';
import { EventsContext } from '../context/EventsContext';

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) throw new Error('useEvents debe usarse dentro de EventsProvider');
  return context;
}
