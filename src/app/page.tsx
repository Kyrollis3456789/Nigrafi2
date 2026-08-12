"use client";

import { useState, useEffect } from 'react';
import { MainDashboard } from '../components/MainDashboard';
import { PiGraphiSplashScreen } from '../components/PiGraphiSplashScreen';
import { PiGraphiReader } from '../components/PiGraphiReader';

type ActiveModule = 'dashboard' | 'pi-graphi' | 'settings';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [showSplash, setShowSplash] = useState(false);
  const [autoOpenSettings, setAutoOpenSettings] = useState(false);

  const handleSelectModule = (module: 'pi-graphi' | 'settings') => {
    if (module === 'pi-graphi') {
      setActiveModule('pi-graphi');
      setAutoOpenSettings(false);
      setShowSplash(true);

      setTimeout(() => {
        setShowSplash(false);
      }, 2500);
    } else if (module === 'settings') {
      setActiveModule('pi-graphi');
      setAutoOpenSettings(true);
      setShowSplash(true);
      setTimeout(() => {
        setShowSplash(false);
      }, 2500);
    }
  };

  const handleGoBack = () => {
    setActiveModule('dashboard');
    setShowSplash(false);
    setAutoOpenSettings(false);
  };

  // Dashboard view
  if (activeModule === 'dashboard') {
    return <MainDashboard onSelectModule={handleSelectModule} />;
  }

  // Splash screen view
  if (activeModule === 'pi-graphi' && showSplash) {
    return <PiGraphiSplashScreen />;
  }

  // Bible Reader view
  if (activeModule === 'pi-graphi' && !showSplash) {
    return <PiGraphiReader onGoBack={handleGoBack} initialSettingsOpen={autoOpenSettings} />;
  }

  // Fallback
  return <MainDashboard onSelectModule={handleSelectModule} />;
}
