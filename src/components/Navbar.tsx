
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield } from 'lucide-react';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-effect border-b border-netra-border px-6 py-4 relative"
    >
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-4"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-netra-primary rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-netra-text font-display">
                Netra
              </h1>
              <p className="text-sm text-netra-text-secondary">AI Surveillance System</p>
            </div>
          </div>
        </motion.div>
        
        <div className="flex items-center space-x-6">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5 text-netra-text-secondary hover:text-netra-primary transition-colors cursor-pointer" />
            <motion.div 
              className="absolute -top-1 -right-1 w-3 h-3 bg-netra-danger rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
          
          <div className="text-sm">
            <div className="status-indicator status-active">
              SYSTEM ACTIVE
            </div>
            <div className="text-netra-text-muted text-xs mt-1">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-netra-primary to-transparent opacity-50" />
    </motion.nav>
  );
};

export default Navbar;
