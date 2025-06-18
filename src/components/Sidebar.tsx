
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Video, FileText, Bell, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'live-stream', label: 'Live Stream', icon: Video },
    { id: 'crime-logs', label: 'Detection Logs', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div 
      className={`glass-effect border-r border-netra-border h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="p-4 border-b border-netra-border">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center p-2 text-netra-text-secondary hover:text-netra-primary transition-colors rounded-lg hover:bg-netra-bg-tertiary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </motion.button>
      </div>

      <nav className="mt-2 px-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 mb-1 rounded-xl text-left transition-all duration-300 ${
                isActive 
                  ? 'bg-netra-primary text-white shadow-lg shadow-netra-primary/25' 
                  : 'text-netra-text-secondary hover:text-netra-text hover:bg-netra-bg-tertiary'
              }`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className="w-5 h-5" />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div 
                  className="ml-auto w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* System Stats */}
      {!isCollapsed && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4 netra-panel p-4"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h4 className="text-sm font-semibold text-netra-text mb-3">System Status</h4>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-netra-text-secondary">CPU Usage:</span>
              <span className="text-netra-warning font-medium">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-netra-text-secondary">Active Threats:</span>
              <span className="text-netra-danger font-medium">2</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-netra-text-secondary">Detection FPS:</span>
              <span className="text-netra-success font-medium">30.2</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
