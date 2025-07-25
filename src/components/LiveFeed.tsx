import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Video, Camera, AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LiveFeed = () => {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    if (isStreamActive) {
      startStream();
    } else {
      stopStream();
    }

    return () => stopStream();
  }, [isStreamActive]);

  const startStream = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    setConnectionStatus('connecting');
    setError('');
    
    intervalRef.current = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/frame`, {
          method: 'GET',
          headers: {
            'Accept': 'image/jpeg',
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);
          
          if (imgRef.current) {
            // Clean up previous object URL
            if (imgRef.current.src.startsWith('blob:')) {
              URL.revokeObjectURL(imgRef.current.src);
            }
            imgRef.current.src = imageUrl;
            setConnectionStatus('connected');
            setLastUpdate(new Date().toLocaleTimeString());
            setError('');
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to fetch frame:', error);
        setConnectionStatus('error');
        setError(error instanceof Error ? error.message : 'Unknown error');
        
        if (error instanceof Error && error.message.includes('fetch')) {
          toast({
            title: "Connection Error",
            description: "Failed to connect to backend. Make sure it's running on localhost:8000",
            variant: "destructive",
          });
        }
      }
    }, 100); // Update every 100ms for smooth video
  };

  const stopStream = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    
    // Clean up object URL
    if (imgRef.current && imgRef.current.src.startsWith('blob:')) {
      URL.revokeObjectURL(imgRef.current.src);
      imgRef.current.src = '';
    }
    
    setConnectionStatus('disconnected');
    setError('');
  };

  const handleReconnect = () => {
    toast({
      title: "Reconnecting...",
      description: "Attempting to reconnect to video stream",
    });
    
    stopStream();
    setTimeout(() => {
      if (isStreamActive) {
        startStream();
      }
    }, 1000);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-netra-success';
      case 'connecting': return 'text-netra-warning';
      case 'error': return 'text-netra-danger';
      default: return 'text-netra-text-secondary';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'LIVE';
      case 'connecting': return 'CONNECTING...';
      case 'error': return 'CONNECTION ERROR';
      default: return 'OFFLINE';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        className="netra-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-netra-text flex items-center">
            <Video className="w-5 h-5 mr-2 text-netra-primary" />
            LIVE SURVEILLANCE FEED
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-netra-success animate-pulse' : 
                connectionStatus === 'connecting' ? 'bg-netra-warning animate-pulse' : 
                'bg-netra-danger'
              }`} />
              <span className={`text-sm ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
            {lastUpdate && (
              <span className="text-xs text-netra-text-secondary">
                Last update: {lastUpdate}
              </span>
            )}
          </div>
        </div>

        <div className="relative aspect-video bg-netra-bg rounded border border-netra-border overflow-hidden">
          <img
            ref={imgRef}
            alt="Live Feed"
            className={`w-full h-full object-contain ${isStreamActive ? 'block' : 'hidden'}`}
          />
          
          {!isStreamActive && (
            <div className="absolute inset-0 bg-gradient-to-br from-netra-bg-secondary to-netra-bg flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 text-netra-text-secondary mx-auto mb-4" />
                <p className="text-netra-text-secondary">Click "START STREAM" to begin monitoring</p>
              </div>
            </div>
          )}
          
          {connectionStatus === 'error' && isStreamActive && (
            <div className="absolute inset-0 bg-netra-danger/20 flex items-center justify-center">
              <div className="text-center text-netra-danger">
                <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm font-medium">Backend Connection Failed</div>
                <div className="text-xs">{error}</div>
                <div className="text-xs mt-1">Check if backend is running on {BACKEND_URL}</div>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded text-xs text-netra-success">
            CAM-01 | Backend: {BACKEND_URL}
          </div>
        </div>

        <div className="flex space-x-4 mt-4">
          <motion.button
            onClick={() => setIsStreamActive(!isStreamActive)}
            className={`netra-button ${isStreamActive ? 'netra-button-danger' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isStreamActive ? 'STOP STREAM' : 'START STREAM'}
          </motion.button>
          
          {isStreamActive && (
            <motion.button
              onClick={handleReconnect}
              className="netra-button-secondary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>RECONNECT</span>
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveFeed;
