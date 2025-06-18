
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Video, FileText, Bell, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout },
    { id: 'live-stream', label: 'Live Stream', icon: Video },
    { id: 'crime-logs', label: 'Crime Logs', icon: FileText },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <motion.div 
      className={`bg-cyber-bg-secondary border-r border-cyber-green/30 h-full transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <div className="p-4">
        <motion.button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full text-left text-cyber-green hover:text-cyber-yellow transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCollapsed ? '>>>' : '<<<'}
        </motion.button>
      </div>

      <nav className="mt-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left transition-all duration-300 ${
                isActive 
                  ? 'bg-cyber-green/20 text-cyber-green border-r-2 border-cyber-green' 
                  : 'text-cyber-green/70 hover:text-cyber-green hover:bg-cyber-green/10'
              }`}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'animate-text-glow' : ''}`} />
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {isActive && !isCollapsed && (
                <motion.div 
                  className="ml-auto w-2 h-2 bg-cyber-green rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* System Stats */}
      {!isCollapsed && (
        <motion.div 
          className="absolute bottom-4 left-4 right-4 cyber-panel"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-cyber-green/70">CPU:</span>
              <span className="text-cyber-yellow">67%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-green/70">THREATS:</span>
              <span className="text-cyber-red">2 ACTIVE</span>
            </div>
            <div className="flex justify-between">
              <span className="text-cyber-green/70">FPS:</span>
              <span className="text-cyber-blue">30.2</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
