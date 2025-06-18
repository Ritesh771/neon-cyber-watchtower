
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SystemSettings {
  cameraResolution: string;
  detectionSensitivity: 'low' | 'medium' | 'high';
  alertNotifications: boolean;
  autoArchive: boolean;
  recordingEnabled: boolean;
  streamQuality: string;
  alertSound: boolean;
  maxLogRetention: number;
}

const Settings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    cameraResolution: '1920x1080',
    detectionSensitivity: 'high',
    alertNotifications: true,
    autoArchive: true,
    recordingEnabled: true,
    streamQuality: 'high',
    alertSound: true,
    maxLogRetention: 30
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const { toast } = useToast();

  const BACKEND_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchSystemStatus();
    loadSettings();
  }, []);

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/status`);
      if (response.ok) {
        const data = await response.json();
        setSystemStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('netra-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('netra-settings', JSON.stringify(settings));
      
      // Attempt to save to backend if available
      try {
        await fetch(`${BACKEND_URL}/configure`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(settings),
        });
      } catch (backendError) {
        console.log('Backend not available, settings saved locally');
      }

      toast({
        title: "Settings Saved",
        description: "Your system configuration has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    setSettings({
      cameraResolution: '1920x1080',
      detectionSensitivity: 'high',
      alertNotifications: true,
      autoArchive: true,
      recordingEnabled: true,
      streamQuality: 'high',
      alertSound: true,
      maxLogRetention: 30
    });
    
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const handleSettingChange = (key: keyof SystemSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'running':
      case 'online': return 'text-netra-success';
      case 'warning': return 'text-netra-warning';
      case 'error':
      case 'offline': return 'text-netra-danger';
      default: return 'text-netra-text-secondary';
    }
  };

  return (
    <div className="p-6">
      <motion.div 
        className="netra-panel max-w-4xl mx-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-netra-text flex items-center">
            <SettingsIcon className="w-6 h-6 mr-3 text-netra-primary" />
            System Configuration
          </h2>
          <div className="flex space-x-3">
            <motion.button
              onClick={resetSettings}
              className="netra-button-secondary flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset</span>
            </motion.button>
            <motion.button
              onClick={saveSettings}
              disabled={isLoading}
              className="netra-button flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-netra-text border-b border-netra-border pb-2">
              Camera Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Camera Resolution</span>
                <select
                  value={settings.cameraResolution}
                  onChange={(e) => handleSettingChange('cameraResolution', e.target.value)}
                  className="bg-netra-bg-secondary border border-netra-border rounded px-3 py-1 text-netra-text"
                >
                  <option value="1280x720">1280x720 (HD)</option>
                  <option value="1920x1080">1920x1080 (FHD)</option>
                  <option value="2560x1440">2560x1440 (QHD)</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Stream Quality</span>
                <select
                  value={settings.streamQuality}
                  onChange={(e) => handleSettingChange('streamQuality', e.target.value)}
                  className="bg-netra-bg-secondary border border-netra-border rounded px-3 py-1 text-netra-text"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Recording Enabled</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.recordingEnabled}
                    onChange={(e) => handleSettingChange('recordingEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-netra-bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netra-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Detection Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-netra-text border-b border-netra-border pb-2">
              Detection Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Detection Sensitivity</span>
                <select
                  value={settings.detectionSensitivity}
                  onChange={(e) => handleSettingChange('detectionSensitivity', e.target.value as 'low' | 'medium' | 'high')}
                  className="bg-netra-bg-secondary border border-netra-border rounded px-3 py-1 text-netra-text"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Alert Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.alertNotifications}
                    onChange={(e) => handleSettingChange('alertNotifications', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-netra-bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netra-primary"></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Alert Sound</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.alertSound}
                    onChange={(e) => handleSettingChange('alertSound', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-netra-bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netra-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* System Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-netra-text border-b border-netra-border pb-2">
              System Settings
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Auto-Archive</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoArchive}
                    onChange={(e) => handleSettingChange('autoArchive', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-netra-bg-secondary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-netra-primary"></div>
                </label>
              </div>

              <div className="flex justify-between items-center py-3">
                <span className="text-netra-text">Log Retention (days)</span>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.maxLogRetention}
                  onChange={(e) => handleSettingChange('maxLogRetention', parseInt(e.target.value))}
                  className="bg-netra-bg-secondary border border-netra-border rounded px-3 py-1 text-netra-text w-20"
                />
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-netra-text border-b border-netra-border pb-2">
              System Status
            </h3>
            
            <div className="space-y-3">
              {systemStatus ? (
                <>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-netra-text">Backend Status</span>
                    <span className={`font-medium ${getStatusColor(systemStatus.status)}`}>
                      {systemStatus.status?.toUpperCase() || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-netra-text">Active Alerts</span>
                    <span className="text-netra-danger font-medium">
                      {systemStatus.alert_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-netra-text">Uptime</span>
                    <span className="text-netra-success font-medium">
                      {systemStatus.uptime || 'N/A'}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-netra-text-secondary">
                  Backend connection required for system status
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
