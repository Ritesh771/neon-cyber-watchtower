
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

const TerminalLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentTyping, setCurrentTyping] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  const sampleLogs = [
    { level: 'info', message: 'System initialized successfully' },
    { level: 'success', message: 'Camera connection established: CAM-01' },
    { level: 'info', message: 'AI model loaded: YOLOv8-crime-detection' },
    { level: 'warning', message: 'Suspicious object detected: knife' },
    { level: 'error', message: 'ALERT: Weapon identified in frame 1247' },
    { level: 'info', message: 'Telegram notification sent to admin' },
    { level: 'success', message: 'Evidence snapshot saved: evidence_001.jpg' },
    { level: 'warning', message: 'Motion detected in restricted area' },
    { level: 'error', message: 'CRITICAL: Gun detected - authorities notified' },
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
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-cyber-red';
      case 'warning': return 'text-cyber-yellow';
      case 'success': return 'text-cyber-green';
      default: return 'text-cyber-blue';
    }
  };

  const getLevelPrefix = (level: string) => {
    switch (level) {
      case 'error': return '[CRITICAL]';
      case 'warning': return '[WARNING]';
      case 'success': return '[SUCCESS]';
      default: return '[INFO]';
    }
  };

  return (
    <motion.div 
      className="cyber-panel h-96"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-cyber-green flex items-center">
          <Terminal className="w-5 h-5 mr-2" />
          REAL-TIME DETECTION LOGS
        </h3>
        <button 
          onClick={() => setLogs([])}
          className="text-xs cyber-button"
        >
          CLEAR
        </button>
      </div>

      <div className="bg-black rounded border border-cyber-green/30 p-4 h-80 overflow-y-auto font-mono text-sm">
        <div className="text-cyber-green mb-2">
          CyberCrime Detection System v2.1 - Logging initiated...
        </div>
        <div className="text-cyber-green/70 mb-4">
          =====================================
        </div>

        {logs.map((log, index) => (
          <motion.div
            key={log.id}
            className="mb-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <span className="text-cyber-green/70">[{log.timestamp}]</span>
            <span className={`ml-2 ${getLevelColor(log.level)}`}>
              {getLevelPrefix(log.level)}
            </span>
            <span className="ml-2 text-white">{log.message}</span>
          </motion.div>
        ))}

        <div className="flex items-center text-cyber-green">
          <span>root@cyberwatch:~$ </span>
          <span className="terminal-cursor ml-1"></span>
        </div>
        
        <div ref={logsEndRef} />
      </div>
    </motion.div>
  );
};

export default TerminalLogs;
