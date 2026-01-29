import { useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { Header } from './components/Header';
import { StatusPanel } from './components/StatusPanel';
import { MapVisualizer } from './components/MapVisualizer';
import { ControlPanel } from './components/ControlPanel';
import { mockService } from './services/mockRobot';

function App() {
  useEffect(() => {
    mockService.start();
    return () => mockService.stop();
  }, []);

  return (
    <MainLayout
      header={<Header />}
      leftPanel={<StatusPanel />}
      rightPanel={<ControlPanel />}
    >
      <MapVisualizer />
    </MainLayout>
  );
}

export default App;
