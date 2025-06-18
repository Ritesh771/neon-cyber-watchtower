
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Activity, Camera, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchSystemStatus();
    
    const interval = setInterval(fetchSystemStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/status`);
      
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
        
        if (connectionStatus === 'error') {
          toast({
            title: "Backend Connected",
            description: "Successfully connected to the detection backend",
          });
        }
        
        setConnectionStatus('connected');
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      setConnectionStatus('error');
    }
  };

  const getSystemHealth = () => {
    if (!systemStatus) return 'unknown';
    
    const hasHighCPU = systemStatus.cpu_usage && systemStatus.cpu_usage > 80;
    const hasHighMemory = systemStatus.memory_usage && systemStatus.memory_usage > 90;
    const hasLowFPS = systemStatus.detection_fps < 10;
    
    if (hasHighCPU || hasHighMemory || hasLowFPS) return 'warning';
    if (connectionStatus === 'error') return 'error';
    return 'healthy';
  };

  const formatUptime = (uptime: string) => {
    if (!uptime) return 'Unknown';
    
    // If uptime is already formatted, return as is
    if (uptime.includes('h') || uptime.includes('m') || uptime.includes('s')) {
      return uptime;
    }
    
    // If it's a number, treat as seconds
    const seconds = parseInt(uptime);
    if (isNaN(seconds)) return uptime;
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <div className="p-6 space-y-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <LiveFeed />
        </div>

        <div className="space-y-6">
          <TerminalLogs />
          <AlertPanel />
        </div>
      </div>

      <motion.div 
        className="netra-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-netra-text mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-netra-primary" />
          System Performance
          <div className={`ml-3 w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-netra-success animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-netra-warning animate-pulse' :
            'bg-netra-danger'
          }`} />
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Camera className="w-6 h-6 text-netra-success mr-2" />
              <div className="text-3xl font-bold text-netra-success">
                {systemStatus?.active_cameras || '0'}
              </div>
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              Active Cameras
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-6 h-6 text-netra-primary mr-2" />
              <div className="text-3xl font-bold text-netra-primary">
                {systemStatus?.detection_fps ? `${systemStatus.detection_fps.toFixed(1)}` : '0.0'}
              </div>
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              Detection FPS
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Shield className="w-6 h-6 text-netra-warning mr-2" />
              <div className="text-3xl font-bold text-netra-warning">
                {systemStatus?.uptime ? formatUptime(systemStatus.uptime) : 'Unknown'}
              </div>
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              System Uptime
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <AlertCircle className="w-6 h-6 text-netra-danger mr-2" />
              <div className="text-3xl font-bold text-netra-danger">
                {systemStatus?.total_alerts ?? '0'}
              </div>
            </div>
            <div className="text-sm text-netra-text-secondary uppercase tracking-wide">
              Total Alerts
            </div>
          </div>
        </div>
        
        {systemStatus && (
          <div className="mt-6 pt-4 border-t border-netra-border">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-netra-text-secondary">
                  Backend Status: 
                  <span className={`ml-1 font-medium ${
                    connectionStatus === 'connected' ? 'text-netra-success' : 'text-netra-danger'
                  }`}>
                    {connectionStatus === 'connected' ? systemStatus.backend_status : 'OFFLINE'}
                  </span>
                </span>
                {systemStatus.cpu_usage && (
                  <span className="text-netra-text-secondary">
                    CPU: <span className="text-netra-primary font-medium">{systemStatus.cpu_usage.toFixed(1)}%</span>
                  </span>
                )}
                {systemStatus.memory_usage && (
                  <span className="text-netra-text-secondary">
                    Memory: <span className="text-netra-primary font-medium">{systemStatus.memory_usage.toFixed(1)}%</span>
                  </span>
                )}
              </div>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                getSystemHealth() === 'healthy' ? 'bg-netra-success/20 text-netra-success' :
                getSystemHealth() === 'warning' ? 'bg-netra-warning/20 text-netra-warning' :
                'bg-netra-danger/20 text-netra-danger'
              }`}>
                {getSystemHealth() === 'healthy' ? 'SYSTEM HEALTHY' :
                 getSystemHealth() === 'warning' ? 'PERFORMANCE WARNING' :
                 'SYSTEM ERROR'}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
