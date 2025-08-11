import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PortfolioProvider from './context/PortfolioContext';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading and system check
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-terminal-dark flex items-center justify-center">
        <div className="text-terminal-green font-mono text-center space-y-4">
          <div className="text-2xl font-bold mb-4">Shubh Soni Portfolio Terminal</div>
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin w-5 h-5 border-2 border-terminal-green border-t-transparent rounded-full"></div>
            <span>Initializing system...</span>
          </div>
          <div className="text-sm text-terminal-dim space-y-1 max-w-md">
            <div className="flex justify-between">
              <span>Loading portfolio data...</span>
              <span className="text-terminal-green">✓</span>
            </div>
            <div className="flex justify-between">
              <span>Starting 3D graphics engine...</span>
              <span className="text-terminal-green">✓</span>
            </div>
            <div className="flex justify-between">
              <span>Initializing terminal interface...</span>
              <span className="text-terminal-yellow animate-pulse">...</span>
            </div>
            <div className="flex justify-between">
              <span>Preparing interactive experience...</span>
              <span className="text-terminal-dim">...</span>
            </div>
            <div className="flex justify-between">
              <span>Loading Shubh Soni's portfolio...</span>
              <span className="text-terminal-green">✓</span>
            </div>
          </div>
          <div className="text-xs text-terminal-dim mt-4">
            <div>Welcome to Shubh Soni's Portfolio Terminal</div>
            <div>Type 'help' for available commands</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<MainLayout />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </div>
  );
}

export default App;