
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const TerminalLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const sampleLogs = [
    { level: 'info', message: 'System initialized successfully' },
    { level: 'success', message: 'Camera connection established: CAM-01' },
    { level: 'info', message: 'AI model loaded: YOLOv8-detection' },
    { level: 'warning', message: 'Suspicious object detected: knife' },
    { level: 'error', message: 'ALERT: Weapon identified in frame 1247' },
    { level: 'info', message: 'Notification sent to security team' },
    { level: 'success', message: 'Evidence snapshot saved: evidence_001.jpg' },
    { level: 'warning', message: 'Motion detected in restricted area' },
    { level: 'error', message: 'CRITICAL: Firearm detected - authorities notified' },
    { level: 'info', message: 'System scan completed - 0 active threats' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
      const newLog: LogEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        level: randomLog.level as 'info' | 'warning' | 'error' | 'success',
        message: randomLog.message,
      };

      setLogs(prev => [...prev.slice(-20), newLog]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-netra-danger';
      case 'warning': return 'text-netra-warning';
      case 'success': return 'text-netra-success';
      default: return 'text-netra-primary';
    }
  };

  const getLevelPrefix = (level: string) => {
    switch (level) {
      case 'error': return '[ERROR]';
      case 'warning': return '[WARN]';
      case 'success': return '[SUCCESS]';
      default: return '[INFO]';
    }
  };

  return (
    <motion.div 
      className="netra-panel h-96"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-netra-text flex items-center">
          <Terminal className="w-5 h-5 mr-2 text-netra-primary" />
          Detection Logs
        </h3>
        <button 
          onClick={() => setLogs([])}
          className="flex items-center space-x-2 text-netra-text-secondary hover:text-netra-danger transition-colors"
        >
          <X className="w-4 h-4" />
          <span className="text-sm">Clear</span>
        </button>
      </div>

      <div className="bg-netra-bg rounded-xl border border-netra-border p-4 h-80 overflow-y-auto font-mono text-sm">
        <div className="text-netra-primary mb-2 font-medium">
          Netra Detection System v2.1 - Logging initiated...
        </div>
        <div className="text-netra-text-muted mb-4 border-b border-netra-border pb-2">
          Real-time threat detection and analysis
        </div>

        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            className="mb-2 p-2 rounded bg-netra-bg-secondary/50"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start space-x-3">
              <span className="text-netra-text-muted text-xs">{log.timestamp}</span>
              <span className={`text-xs font-medium ${getLevelColor(log.level)}`}>
                {getLevelPrefix(log.level)}
              </span>
              <span className="text-netra-text text-xs flex-1">{log.message}</span>
            </div>
          </motion.div>
        ))}

        <div className="flex items-center text-netra-primary mt-4">
          <span>netra@system:~$ </span>
          <span className="terminal-cursor ml-1"></span>
        </div>
        
        <div ref={logsEndRef} />
      </div>
    </motion.div>
  );
};

export default TerminalLogs;
