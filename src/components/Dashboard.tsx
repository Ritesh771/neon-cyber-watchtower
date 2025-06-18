
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

      {/* System Metrics */}
      <motion.div 
        className="netra-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-netra-text mb-6">System Performance</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-success mb-2">24/7</div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">Monitoring</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-primary mb-2">98.7%</div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-warning mb-2">15.2ms</div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-danger mb-2">2</div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">Active Threats</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
