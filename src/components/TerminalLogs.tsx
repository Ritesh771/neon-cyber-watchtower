import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal, X, AlertCircle, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: any;
}

const TerminalLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error' | 'connecting'>('connecting');
  const [autoScroll, setAutoScroll] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchLogs();
    
    const interval = setInterval(fetchLogs, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const fetchLogs = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/logs`);
      
      if (response.ok) {
        const data = await response.json();
        setConnectionStatus('connected');
        
        if (data.logs && Array.isArray(data.logs)) {
          const formattedLogs = data.logs.map((log: any, index: number) => ({
            id: `${log.timestamp}_${index}`,
            timestamp: new Date(log.timestamp).toLocaleTimeString(),
            level: getLogLevel(log.alert_type || log.type),
            message: formatLogMessage(log),
            details: log
          }));
          
          setLogs(formattedLogs);
        }
      } else {
        setConnectionStatus('error');
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setConnectionStatus('error');
    }
  };

  const getLogLevel = (alertType: string): 'info' | 'warning' | 'error' | 'success' => {
    if (!alertType) return 'info';
    
    const type = alertType.toLowerCase();
    if (type.includes('weapon') || type.includes('gun') || type.includes('knife')) return 'error';
    if (type.includes('suspicious') || type.includes('anomaly')) return 'warning';
    if (type.includes('normal') || type.includes('safe')) return 'success';
    return 'info';
  };

  const formatLogMessage = (log: any): string => {
    if (log.alert_type && log.details) {
      return `${log.alert_type.toUpperCase()}: ${log.details.description || 'Detection event'}`;
    }
    if (log.message) return log.message;
    if (log.type) return `${log.type.toUpperCase()}: Detection event`;
    return 'System log entry';
  };

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
      case 'error': return '[ALERT]';
      case 'warning': return '[WARN]';
      case 'success': return '[SAFE]';
      default: return '[INFO]';
    }
  };

  const clearLogs = () => {
    setLogs([]);
    toast({
      title: "Logs Cleared",
      description: "All detection logs have been cleared from the panel",
    });
  };

  const exportLogs = () => {
    const logData = logs.map(log => ({
      timestamp: log.timestamp,
      level: log.level,
      message: log.message,
      details: log.details
    }));
    
    const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `netra-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Logs Exported",
      description: "Detection logs have been downloaded as JSON file",
    });
  };

  const handleScroll = () => {
    if (logsContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = logsContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
      setAutoScroll(isAtBottom);
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
          <div className={`ml-3 w-2 h-2 rounded-full ${
            connectionStatus === 'connected' ? 'bg-netra-success animate-pulse' :
            connectionStatus === 'connecting' ? 'bg-netra-warning animate-pulse' :
            'bg-netra-danger'
          }`} />
        </h3>
        <div className="flex items-center space-x-2">
          {connectionStatus === 'error' && (
            <div className="flex items-center text-netra-danger text-xs">
              <AlertCircle className="w-3 h-3 mr-1" />
              Backend Offline
            </div>
          )}
          <button 
            onClick={exportLogs}
            className="flex items-center space-x-1 text-netra-text-secondary hover:text-netra-primary transition-colors text-sm px-2 py-1 rounded"
            disabled={logs.length === 0}
          >
            <Download className="w-3 h-3" />
            <span>Export</span>
          </button>
          <button 
            onClick={clearLogs}
            className="flex items-center space-x-1 text-netra-text-secondary hover:text-netra-danger transition-colors text-sm px-2 py-1 rounded"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div 
        ref={logsContainerRef}
        className="bg-netra-bg rounded-xl border border-netra-border p-4 h-80 overflow-y-auto font-mono text-sm"
        onScroll={handleScroll}
      >
        <div className="text-netra-primary mb-2 font-medium">
          Netra Detection System v2.1 - Backend Connected: {BACKEND_URL}
        </div>
        <div className="text-netra-text-muted mb-4 border-b border-netra-border pb-2">
          Real-time threat detection and analysis
        </div>

        {connectionStatus === 'error' && (
          <div className="text-netra-danger text-center py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <div>Unable to connect to backend</div>
            <div className="text-xs">Make sure the backend is running on {BACKEND_URL}</div>
          </div>
        )}

        {logs.length === 0 && connectionStatus === 'connected' && (
          <div className="text-netra-text-muted text-center py-4">
            No logs available. System monitoring...
          </div>
        )}

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

      {!autoScroll && (
        <motion.button
          onClick={() => {
            setAutoScroll(true);
            logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="absolute bottom-4 right-4 bg-netra-primary text-white px-3 py-1 rounded text-xs"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Scroll to bottom
        </motion.button>
      )}
    </motion.div>
  );
};

export default TerminalLogs;
