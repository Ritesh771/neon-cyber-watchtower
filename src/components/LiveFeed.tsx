
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Camera, AlertTriangle } from 'lucide-react';

const LiveFeed = () => {
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);

  useEffect(() => {
    // Simulate real-time object detection
    const interval = setInterval(() => {
      const objects = ['person', 'car', 'bag', 'knife', 'gun'];
      const randomObjects = objects.slice(0, Math.floor(Math.random() * 3) + 1);
      setDetectedObjects(randomObjects);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getDangerLevel = (object: string) => {
    const dangerous = ['knife', 'gun', 'weapon'];
    return dangerous.includes(object) ? 'danger' : 'safe';
  };

  return (
    <div className="space-y-6">
      {/* Video Feed */}
      <motion.div 
        className="cyber-panel"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cyber-green flex items-center">
            <Video className="w-5 h-5 mr-2" />
            LIVE SURVEILLANCE FEED
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isStreamActive ? 'bg-cyber-green animate-pulse' : 'bg-cyber-red'}`} />
            <span className="text-sm">{isStreamActive ? 'ACTIVE' : 'OFFLINE'}</span>
          </div>
        </div>

        <div className="relative aspect-video bg-black rounded border border-cyber-green/30 overflow-hidden">
          {/* Simulated video feed */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <Camera className="w-16 h-16 text-cyber-green/30" />
          </div>
          
          {/* Stream overlay */}
          <div className="absolute top-4 left-4 bg-black/50 px-2 py-1 rounded text-xs text-cyber-green">
            CAM-01 | 192.168.1.100:8080
          </div>
          
          {/* Detection overlays */}
          {detectedObjects.map((object, index) => (
            <motion.div
              key={`${object}-${index}`}
              className={`absolute border-2 ${
                getDangerLevel(object) === 'danger' 
                  ? 'border-cyber-red bg-cyber-red/20' 
                  : 'border-cyber-green bg-cyber-green/20'
              } rounded`}
              style={{
                top: `${20 + index * 15}%`,
                left: `${30 + index * 20}%`,
                width: '100px',
                height: '80px',
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute -top-6 left-0 text-xs px-1 py-0.5 bg-black/70 rounded">
                {object}
              </div>
            </motion.div>
          ))}

          {/* Scanning effect */}
          <motion.div 
            className="absolute inset-0 border-t-2 border-cyber-green/50"
            animate={{ y: ['0%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          />
        </div>

        <motion.button
          onClick={() => setIsStreamActive(!isStreamActive)}
          className={`mt-4 cyber-button ${isStreamActive ? 'cyber-button-danger' : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isStreamActive ? 'STOP STREAM' : 'START STREAM'}
        </motion.button>
      </motion.div>

      {/* Detection Status */}
      <motion.div 
        className="cyber-panel"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-cyber-green mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          THREAT DETECTION STATUS
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {detectedObjects.map((object, index) => (
            <motion.div
              key={`status-${object}-${index}`}
              className={`p-3 rounded border ${
                getDangerLevel(object) === 'danger'
                  ? 'border-cyber-red bg-cyber-red/10'
                  : 'border-cyber-green bg-cyber-green/10'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-center">
                <div className={`text-2xl mb-2 ${
                  getDangerLevel(object) === 'danger' ? 'text-cyber-red' : 'text-cyber-green'
                }`}>
                  {getDangerLevel(object) === 'danger' ? '⚠️' : '✅'}
                </div>
                <div className="text-sm font-medium uppercase">{object}</div>
                <div className={`text-xs mt-1 ${
                  getDangerLevel(object) === 'danger' ? 'text-cyber-red' : 'text-cyber-green'
                }`}>
                  {getDangerLevel(object) === 'danger' ? 'THREAT' : 'SAFE'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveFeed;
