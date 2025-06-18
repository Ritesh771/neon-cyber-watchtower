
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import LiveFeed from '../components/LiveFeed';
import TerminalLogs from '../components/TerminalLogs';
import AlertPanel from '../components/AlertPanel';
import MatrixBackground from '../components/MatrixBackground';

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
              className="cyber-panel max-w-2xl mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h2 className="text-2xl font-bold text-cyber-green mb-6">SYSTEM CONFIGURATION</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-cyber-green/30">
                  <span>Camera Resolution</span>
                  <span className="text-cyber-blue">1920x1080</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-green/30">
                  <span>Detection Sensitivity</span>
                  <span className="text-cyber-yellow">HIGH</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-green/30">
                  <span>Alert Notifications</span>
                  <span className="text-cyber-green">ENABLED</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-cyber-green/30">
                  <span>Auto-Archive</span>
                  <span className="text-cyber-green">ENABLED</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>System Status</span>
                  <span className="text-cyber-green animate-pulse">OPERATIONAL</span>
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
    <div className="min-h-screen bg-cyber-bg text-cyber-green relative overflow-hidden">
      <MatrixBackground />
      
      <div className="relative z-10 flex flex-col h-screen">
        <Navbar />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <main className="flex-1 overflow-y-auto">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Ambient effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-30" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-30" />
        <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-cyber-green to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-cyber-green to-transparent opacity-30" />
      </div>
    </div>
  );
};

export default Index;
