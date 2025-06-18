
import React from 'react';
import { motion } from 'framer-motion';
import LiveFeed from './LiveFeed';
import TerminalLogs from './TerminalLogs';
import AlertPanel from './AlertPanel';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Feed Section */}
        <div className="lg:col-span-1">
          <LiveFeed />
        </div>

        {/* Logs and Alerts */}
        <div className="space-y-6">
          <TerminalLogs />
          <AlertPanel />
        </div>
      </div>

      {/* System Status Bar */}
      <motion.div 
        className="cyber-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-cyber-green">24/7</div>
            <div className="text-sm text-cyber-green/70">MONITORING</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyber-blue">98.7%</div>
            <div className="text-sm text-cyber-green/70">ACCURACY</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyber-yellow">15.2ms</div>
            <div className="text-sm text-cyber-green/70">RESPONSE TIME</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyber-red">2</div>
            <div className="text-sm text-cyber-green/70">ACTIVE THREATS</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
