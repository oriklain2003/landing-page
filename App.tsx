
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import ComingSoonContent from './components/ComingSoonContent';
import LoginForm from './components/LoginForm';
import BackgroundEffect from './components/BackgroundEffect';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppState(AppState.CONTENT);
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const loginUrl = import.meta.env.VITE_LOGIN_URL as string | undefined;
  const goToLogin = () => {
    if (loginUrl) {
      window.location.href = loginUrl;
    } else {
      setAppState(AppState.LOGIN);
    }
  };
  const goToHome = () => setAppState(AppState.CONTENT);

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden">
      <BackgroundEffect />

      <AnimatePresence mode="wait">
        {appState === AppState.LOADING && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]"
          >
            <LoadingScreen />
          </motion.div>
        )}

        {appState === AppState.CONTENT && (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full"
          >
            <ComingSoonContent onLoginClick={goToLogin} />
          </motion.div>
        )}

        {appState === AppState.LOGIN && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-20 flex items-center justify-center p-6 overflow-y-auto"
          >
            <LoginForm onBack={goToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
