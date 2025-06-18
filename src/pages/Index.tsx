
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LiveFeed from '../components/LiveFeed';
import TerminalLogs from '../components/TerminalLogs';
import AlertPanel from '../components/AlertPanel';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

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
        return (
          <div className="p-6">
            <motion.div 
              className="netra-panel max-w-2xl mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-netra-text mb-6">System Configuration</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-netra-border">
                  <span className="text-netra-text">Camera Resolution</span>
                  <span className="text-netra-primary font-medium">1920x1080</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-netra-border">
                  <span className="text-netra-text">Detection Sensitivity</span>
                  <span className="status-indicator status-warning">HIGH</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-netra-border">
                  <span className="text-netra-text">Alert Notifications</span>
                  <span className="status-indicator status-active">ENABLED</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-netra-border">
                  <span className="text-netra-text">Auto-Archive</span>
                  <span className="status-indicator status-active">ENABLED</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-netra-text">System Status</span>
                  <span className="status-indicator status-active animate-pulse">OPERATIONAL</span>
                </div>
              </div>
            </motion.div>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-netra-bg text-netra-text relative">
      <div className="flex flex-col h-screen">
        <Navbar />
        
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
