
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Bell, AlertCircle, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  timestamp: string;
  type: 'weapon' | 'suspicious' | 'breach' | 'anomaly';
  message: string;
  location: string;
  severity: 'high' | 'medium' | 'low';
  details?: any;
}

const AlertPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');
  const [lastAlertCount, setLastAlertCount] = useState(0);
  const { toast } = useToast();

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchAlerts();
    
    const interval = setInterval(fetchAlerts, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (alerts.length > lastAlertCount && soundEnabled && lastAlertCount > 0) {
      playAlertSound();
      
      // Show toast for new alert
      const newAlert = alerts[0];
      if (newAlert) {
        toast({
          title: `${newAlert.severity.toUpperCase()} PRIORITY ALERT`,
          description: newAlert.message,
          variant: newAlert.severity === 'high' ? 'destructive' : 'default',
        });
      }
    }
    setLastAlertCount(alerts.length);
  }, [alerts.length, soundEnabled, lastAlertCount, toast]);

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/logs`);
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('connected');
        
        if (data.logs && Array.isArray(data.logs)) {
          const alertData = data.logs
            .filter((log: any) => 
              log.alert_type && (
                log.alert_type.toLowerCase().includes('weapon') ||
                log.alert_type.toLowerCase().includes('gun') ||
                log.alert_type.toLowerCase().includes('knife') ||
                log.alert_type.toLowerCase().includes('suspicious') ||
                log.alert_type.toLowerCase().includes('anomaly') ||
                log.alert_type.toLowerCase().includes('breach')
              )
            )
            .map((log: any) => ({
              id: `${log.timestamp}_${log.alert_type}`,
              timestamp: new Date(log.timestamp).toLocaleString(),
              type: getAlertType(log.alert_type),
              message: log.details?.description || `${log.alert_type} detected`,
              location: log.details?.location || 'Camera 01 - Main Area',
              severity: getSeverity(log.alert_type),
              details: log
            }))
            .slice(0, 10);
          
          setAlerts(alertData);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setConnectionStatus('error');
    }
  };

  const getAlertType = (alertType: string): 'weapon' | 'suspicious' | 'breach' | 'anomaly' => {
    const type = alertType.toLowerCase();
    if (type.includes('weapon') || type.includes('gun') || type.includes('knife')) return 'weapon';
    if (type.includes('breach') || type.includes('unauthorized')) return 'breach';
    if (type.includes('anomaly') || type.includes('unusual')) return 'anomaly';
    return 'suspicious';
  };

  const getSeverity = (alertType: string): 'high' | 'medium' | 'low' => {
    const type = alertType.toLowerCase();
    if (type.includes('weapon') || type.includes('gun')) return 'high';
    if (type.includes('knife') || type.includes('breach')) return 'high';
    if (type.includes('suspicious') || type.includes('anomaly')) return 'medium';
    return 'low';
  };

  const playAlertSound = () => {
    try {
      // Create a more professional alert sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "Alert has been removed from the panel",
    });
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    toast({
      title: soundEnabled ? "Sound Disabled" : "Sound Enabled",
      description: `Alert notifications are now ${soundEnabled ? 'muted' : 'active'}`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-netra-danger bg-netra-danger/10 text-netra-danger';
      case 'medium': return 'border-netra-warning bg-netra-warning/10 text-netra-warning';
      default: return 'border-netra-primary bg-netra-primary/10 text-netra-primary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon': return '⚔️';
      case 'suspicious': return '👁️';
      case 'breach': return '🚨';
      case 'anomaly': return '⚠️';
      default: return '🔍';
    }
  };

  return (
    <motion.div 
      className="netra-panel"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-netra-text flex items-center">
          <Bell className="w-5 h-5 mr-2 text-netra-primary" />
          ACTIVE ALERTS ({alerts.length})
          <div className={`ml-3 w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-netra-success animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-netra-warning animate-pulse' :
            'bg-netra-danger'
          }`} />
        </h3>
        <div className="flex items-center space-x-3">
          {connectionStatus === 'error' && (
            <div className="flex items-center text-netra-danger text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Backend Offline
            </div>
          )}
          <motion.button
            onClick={toggleSound}
            className={`text-xs netra-button-secondary px-3 py-1 flex items-center space-x-2 ${!soundEnabled ? 'opacity-50' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            <span>SOUND</span>
          </motion.button>
        </div>
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

        {alerts.length === 0 && connectionStatus === 'connected' && (
          <motion.div 
            className="text-center py-8 text-netra-success/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-4xl mb-2">✅</div>
            <div>No active alerts</div>
            <div className="text-sm">System monitoring normally</div>
          </motion.div>
        )}

        {connectionStatus === 'error' && (
          <div className="text-center py-8 text-netra-danger">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            <div>Unable to fetch alerts</div>
            <div className="text-sm">Backend connection required</div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlertPanel;
