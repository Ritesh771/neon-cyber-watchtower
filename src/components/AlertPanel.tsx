
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Bell } from 'lucide-react';

interface Alert {
  id: string;
  timestamp: string;
  type: 'weapon' | 'suspicious' | 'breach';
  message: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sampleAlerts = [
    {
      type: 'weapon' as const,
      message: 'Knife detected in surveillance area',
      location: 'Camera 01 - Main Entrance',
      severity: 'high' as const,
    },
    {
      type: 'suspicious' as const,
      message: 'Unusual movement pattern detected',
      location: 'Camera 03 - Parking Lot',
      severity: 'medium' as const,
    },
    {
      type: 'breach' as const,
      message: 'Unauthorized access attempt',
      location: 'Camera 02 - Restricted Zone',
      severity: 'high' as const,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const randomAlert = sampleAlerts[Math.floor(Math.random() * sampleAlerts.length)];
        const newAlert: Alert = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleString(),
          ...randomAlert,
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 9)]);

        // Play alert sound
        if (soundEnabled) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/LQdCgGKXHA8dqLOQgXZrjr7aFQEgtTqOT1tWIeBDWS2e/KdCsHKHLB8t2OPAkVZLTH8N2QQAoUXrTp66hVFApGn+DyvmYeAzJq3/');
          audio.volume = 0.3;
          audio.play().catch(() => {}); // Ignore audio errors
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-cyber-red bg-cyber-red/10 text-cyber-red';
      case 'medium': return 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow';
      default: return 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '🔪';
      case 'suspicious': return '👁️';
      case 'breach': return '🚨';
      default: return '⚠️';
    }
  };

  return (
    <motion.div 
      className="cyber-panel"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyber-red flex items-center">
          <Bell className="w-5 h-5 mr-2 animate-text-glow" />
          ACTIVE ALERTS ({alerts.length})
        </h3>
        <motion.button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`text-xs cyber-button ${!soundEnabled ? 'opacity-50' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {soundEnabled ? '🔊' : '🔇'} SOUND
        </motion.button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              className={`p-4 rounded border-2 ${getSeverityColor(alert.severity)}`}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              layout
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-2">{getTypeIcon(alert.type)}</span>
                    <span className="font-semibold uppercase text-sm">
                      {alert.severity} PRIORITY
                    </span>
                    <motion.div 
                      className="ml-2 w-2 h-2 rounded-full bg-current"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </div>
                  <div className="text-white font-medium mb-1">{alert.message}</div>
                  <div className="text-sm opacity-70">{alert.location}</div>
                  <div className="text-xs opacity-50 mt-2">{alert.timestamp}</div>
                </div>
                <motion.button
                  onClick={() => removeAlert(alert.id)}
                  className="ml-4 p-1 hover:bg-white/20 rounded"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {alerts.length === 0 && (
          <motion.div 
            className="text-center py-8 text-cyber-green/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-2">✅</div>
            <div>No active alerts</div>
            <div className="text-sm">System monitoring normally</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertPanel;
