
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import LiveFeed from './LiveFeed';
import TerminalLogs from './TerminalLogs';
import AlertPanel from './AlertPanel';

interface SystemStatus {
  uptime: string;
  active_cameras: number;
  detection_fps: number;
  total_alerts: number;
  cpu_usage?: number;
  memory_usage?: number;
  backend_status: string;
}

const Dashboard = () => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchSystemStatus();
    
    // Poll for system status every 10 seconds
    const interval = setInterval(fetchSystemStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/status`);
      
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setConnectionStatus('error');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Connection Status Warning */}
      {connectionStatus === 'error' && (
        <motion.div 
          className="netra-panel border-netra-danger bg-netra-danger/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-netra-danger" />
            <div>
              <div className="font-semibold text-netra-danger">Backend Connection Failed</div>
              <div className="text-sm text-netra-text-secondary">
                Make sure the backend is running on {BACKEND_URL}
              </div>
            </div>
          </div>
        </motion.div>
      )}

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
        <h3 className="text-lg font-semibold text-netra-text mb-6 flex items-center">
          System Performance
          <div className={`ml-3 w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-netra-success animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-netra-warning animate-pulse' :
            'bg-netra-danger'
          }`} />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-success mb-2">
              {systemStatus?.active_cameras || '24/7'}
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              {systemStatus ? 'Active Cameras' : 'Monitoring'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-primary mb-2">
              {systemStatus?.detection_fps ? `${systemStatus.detection_fps.toFixed(1)}` : '98.7%'}
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              {systemStatus ? 'Detection FPS' : 'Accuracy'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-warning mb-2">
              {systemStatus?.uptime || '15.2ms'}
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              {systemStatus ? 'Uptime' : 'Response Time'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-netra-danger mb-2">
              {systemStatus?.total_alerts ?? '2'}
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              {systemStatus ? 'Total Alerts' : 'Active Threats'}
            </div>
          </div>
        </div>
        
        {/* Backend Status */}
        {systemStatus && (
          <div className="mt-6 pt-4 border-t border-netra-border">
            <div className="text-sm text-netra-text-secondary">
              Backend Status: <span className="text-netra-success">{systemStatus.backend_status}</span>
              {systemStatus.cpu_usage && (
                <span className="ml-4">
                  CPU: <span className="text-netra-primary">{systemStatus.cpu_usage.toFixed(1)}%</span>
                </span>
              )}
              {systemStatus.memory_usage && (
                <span className="ml-4">
                  Memory: <span className="text-netra-primary">{systemStatus.memory_usage.toFixed(1)}%</span>
                </span>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
