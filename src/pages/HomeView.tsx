import { useEvents } from '../hooks/useEvents';
import { OnThisDay } from '../components/organisms/OnThisDay';

interface HomeViewProps {
  onGoToTimeline: () => void;
}

export function HomeView({ onGoToTimeline }: HomeViewProps) {
  const { events, loading } = useEvents();
  if (loading) return null;

  const validated = events.filter((event) => event.status === 'validated');
  return <OnThisDay events={validated} onGoToTimeline={onGoToTimeline} />;
}
