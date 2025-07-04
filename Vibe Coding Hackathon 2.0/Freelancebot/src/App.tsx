import React, { useState } from 'react';
import Landing from './components/Landing';
import ChatBot from './components/ChatBot';
import Dashboard from './components/Dashboard';

function App() {
  const [currentView, setCurrentView] = useState('landing');

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return (
          <div className="h-screen flex flex-col">
            <div className="flex-1">
              <ChatBot />
            </div>
            <div className="bg-white border-t border-gray-200 p-2">
              <button
                onClick={() => handleNavigate('landing')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        );
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="App">
      {renderView()}
    </div>
  );
}

export default App;