import { useState } from 'react';
import { IdentityProvider } from './context/IdentityContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { EventsProvider } from './context/EventsContext';
import { useIdentity } from './hooks/useIdentity';
import { WelcomeModal } from './components/organisms/WelcomeModal';
import { MainLayout } from './components/templates/MainLayout';
import { TimelineView } from './pages/TimelineView';
import { PendingView } from './pages/PendingView';
import type { ViewKey } from './components/organisms/AppHeader';

function AppShell() {
  const { memberId, setMemberId } = useIdentity();
  const [view, setView] = useState<ViewKey>('timeline');

  if (!memberId) {
    return <WelcomeModal onSelect={setMemberId} />;
  }

  return (
    <MainLayout view={view} onChangeView={setView}>
      {view === 'timeline' ? <TimelineView /> : <PendingView />}
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
