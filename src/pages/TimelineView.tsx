import { useEvents } from '../hooks/useEvents';
import { useAccessibility } from '../hooks/useAccessibility';
import { TimelineList } from '../components/organisms/TimelineList';
import { AssistedTimeline } from '../components/organisms/AssistedTimeline';

export function TimelineView() {
  const { events, loading } = useEvents();
  const { settings } = useAccessibility();
  if (loading) return null;

  const validated = events.filter((event) => event.status === 'validated');

  if (settings.assistedMode) {
    return <AssistedTimeline events={validated} />;
  }
  return <TimelineList events={validated} />;
}
