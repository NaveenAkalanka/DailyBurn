import React, { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { App as CapacitorApp } from '@capacitor/app';
import { ThemeProvider } from './context/ThemeContext.jsx'
import { UserProvider, useUser } from './context/UserContext.jsx'
import { HistoryProvider } from './context/HistoryContext.jsx'

import Home from './pages/Home.jsx'
import DayView from './pages/DayView.jsx'
import WeeklyPlan from './pages/WeeklyPlan.jsx'
import ExerciseLibrary from './pages/ExerciseLibrary.jsx'
import Report from './pages/Report.jsx'
import Settings from './pages/Settings.jsx'
import LiveSession from './pages/LiveSession.jsx'

import Onboarding from './components/Onboarding.jsx'
import Layout from './components/Layout.jsx'
import SplashScreen from './components/SplashScreen.jsx'

function AppRoutes() {
  const { inputs } = useUser();

  return (
    <>
      {!inputs ? (
        <Onboarding />
      ) : (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/day/:dayName" element={<DayView />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
            <Route path="/exercises" element={<ExerciseLibrary />} />
            <Route path="/report" element={<Report />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/live-session" element={<LiveSession />} />

            <Route path="*" element={<Home />} />
          </Routes>
        </Layout>
      )}
    </>
  );
}

export default function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Handle Android Hardware Back Button
    const setupListener = async () => {
      const listener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
        if (window.location.pathname === '/') {
          CapacitorApp.exitApp();
        } else {
          // Go back in history
          navigate(-1);
        }
      });
      return listener;
    };

    const listenerPromise = setupListener();

    return () => {
      listenerPromise.then(l => l.remove());
    };
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(() => {
    // Only show splash if not seen in this session
    return !sessionStorage.getItem('dailyburn_has_seen_splash');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('dailyburn_has_seen_splash', 'true');
    setIsLoading(false);
  };

  return (
    <ThemeProvider>
      <UserProvider>
        <HistoryProvider>
          {isLoading && <SplashScreen onComplete={handleSplashComplete} />}
          {!isLoading && <AppRoutes />}
        </HistoryProvider>
      </UserProvider>
    </ThemeProvider>
  )
}
