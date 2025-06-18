
import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-cyber-bg-secondary border-b border-cyber-green/30 px-6 py-4 relative overflow-hidden"
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.05 }}
        >
          <h1 
            className="text-2xl font-cyber font-bold text-cyber-green glitch-text"
            data-text="🛡️ CyberCrime AI Surveillance"
          >
            🛡️ CyberCrime AI Surveillance
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-6 h-6 text-cyber-red animate-text-glow cursor-pointer" />
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-cyber-red rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          </motion.div>
          
          <div className="text-sm">
            <div className="text-cyber-green">SYSTEM ACTIVE</div>
            <div className="text-cyber-blue text-xs">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated background lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50" />
      </div>
    </motion.nav>
  );
};

export default Navbar;
