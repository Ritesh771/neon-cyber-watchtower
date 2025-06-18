
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LiveFeed from '../components/LiveFeed';
import TerminalLogs from '../components/TerminalLogs';
import AlertPanel from '../components/AlertPanel';
import Settings from '../components/Settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleNotificationClick = () => {
    setActiveTab('alerts');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'live-stream':
        return (
          <div className="p-6">
            <LiveFeed />
          </div>
        );
      case 'crime-logs':
        return (
          <div className="p-6">
            <TerminalLogs />
          </div>
        );
      case 'alerts':
        return (
          <div className="p-6">
            <AlertPanel />
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-netra-bg text-netra-text relative">
      <div className="flex flex-col h-screen">
        <Navbar onNotificationClick={handleNotificationClick} />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
