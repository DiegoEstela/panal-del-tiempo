import { useEvents } from '../hooks/useEvents';
import { TimelineList } from '../components/organisms/TimelineList';

export function TimelineView() {
  const { events, loading } = useEvents();
  if (loading) return null;
  const validated = events.filter((event) => event.status === 'validated');
  return <TimelineList events={validated} />;
}
