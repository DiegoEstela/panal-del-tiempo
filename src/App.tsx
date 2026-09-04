import { useEffect, useState } from 'react';
import { IdentityProvider } from './context/IdentityContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { EventsProvider } from './context/EventsContext';
import { useIdentity } from './hooks/useIdentity';
import { useAccessibility } from './hooks/useAccessibility';
import { WelcomeModal } from './components/organisms/WelcomeModal';
import { MainLayout } from './components/templates/MainLayout';
import { HomeView } from './pages/HomeView';
import { TimelineView } from './pages/TimelineView';
import { PendingView } from './pages/PendingView';
import type { ViewKey } from './components/organisms/AppHeader';

function AppShell() {
  const { memberId, setMemberId } = useIdentity();
  const { settings } = useAccessibility();
  const [view, setView] = useState<ViewKey>('home');

  // Modo Simple solo tiene pantalla propia en la línea de tiempo (y no hay
  // barra inferior para navegar mientras está activo), así que al prenderlo
  // siempre redirige ahí.
  useEffect(() => {
    if (settings.assistedMode) {
      setView('timeline');
    }
  }, [settings.assistedMode]);

  if (!memberId) {
    return <WelcomeModal onSelect={setMemberId} />;
  }

  return (
    <MainLayout view={view} onChangeView={setView}>
      {view === 'home' && <HomeView onGoToTimeline={() => setView('timeline')} />}
      {view === 'timeline' && <TimelineView />}
      {view === 'pending' && <PendingView />}
    </MainLayout>
  );
}

export function App() {
  return (
    <AccessibilityProvider>
      <IdentityProvider>
        <EventsProvider>
          <AppShell />
        </EventsProvider>
      </IdentityProvider>
    </AccessibilityProvider>
  );
}
