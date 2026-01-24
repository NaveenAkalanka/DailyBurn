import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import DayView from './pages/DayView.jsx'
import LiveSession from './pages/LiveSession.jsx'
import { UserProvider, useUser } from './context/UserContext.jsx'
import Onboarding from './components/Onboarding.jsx'
import Layout from './components/Layout.jsx'

function AppRoutes() {
  const { inputs } = useUser();

  return (
    <>
      {!inputs && <Onboarding />}
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/day/:dayName" element={<DayView />} />
          <Route path="/live-session" element={<LiveSession />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </>
  );
}

import { ThemeProvider } from './context/ThemeContext.jsx'
import { useState, useEffect } from 'react'
import SplashScreen from './components/SplashScreen.jsx'

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <ThemeProvider>
      <UserProvider>
        {isLoading && <SplashScreen onComplete={() => setIsLoading(false)} />}
        {!isLoading && <AppRoutes />}
      </UserProvider>
    </ThemeProvider>
  )
}
