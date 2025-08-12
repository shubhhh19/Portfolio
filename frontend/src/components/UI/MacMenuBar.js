import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

const MacMenuBar = ({ currentSection, onSectionChange, onTerminalToggle, isTerminalOpen, onWindowAction }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const { isAdminMode } = usePortfolio();

  const sectionLabelMap = {
    dashboard: 'Dashboard',
    hero: 'Home',
    about: 'About',
    projects: 'Projects',
    skills: 'Skills',
    experience: 'Experience',
    education: 'Education',
    contact: 'Contact',
    help: 'Help',
    techstack: 'Tech Stack',
    resume: 'Resume',
  };

  const baseMenu = [
    { label: 'Dashboard', section: 'dashboard' },
    { label: 'Home', section: 'hero' },
    { label: 'About', section: 'about' },
    { label: 'Skills', section: 'skills' },
    { label: 'Projects', section: 'projects' },
    { label: 'Experience', section: 'experience' },
    { label: 'Education', section: 'education' },
    { label: 'Contact', section: 'contact' },
    { label: 'Resume', section: 'resume' },
  ];
  
  // Admin entry shows only when user is authenticated as admin
  const menuItems = isAdminMode ? [...baseMenu, { label: 'Admin', section: 'admin' }] : baseMenu;

  const handleMenuClick = (item) => {
    if (item.section) {
      onSectionChange(item.section);
      setActiveMenu(null);
    } else if (item.items) {
      setActiveMenu(activeMenu === item.label ? null : item.label);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-terminal-header bg-opacity-90 backdrop-blur-md border-b border-terminal-green border-opacity-30">
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side - Apple menu */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'Apple' ? null : 'Apple')}
              className="text-terminal-text hover:text-terminal-green transition-colors text-sm font-medium"
            >
              🍎 Apple
            </button>
            <AnimatePresence>
              {activeMenu === 'Apple' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-terminal-bg border border-terminal-border rounded-lg shadow-lg py-2 min-w-48"
                >
                  <div className="px-4 py-2 text-terminal-dim text-sm">About This Portfolio</div>
                  <div className="border-t border-terminal-border my-1"></div>
                  <div className="px-4 py-2 text-terminal-dim text-sm">System Preferences...</div>
                  <div className="px-4 py-2 text-terminal-dim text-sm">App Store...</div>
                  <div className="border-t border-terminal-border my-1"></div>
                  <div className="px-4 py-2 text-terminal-dim text-sm">Force Quit...</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Portfolio menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'Portfolio' ? null : 'Portfolio')}
              className="text-terminal-text hover:text-terminal-green transition-colors text-sm font-medium"
            >
              Portfolio
            </button>
            <AnimatePresence>
              {activeMenu === 'Portfolio' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-terminal-bg border border-terminal-border rounded-lg shadow-lg py-2 min-w-48"
                >
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => handleMenuClick(item)}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-terminal-green hover:text-black transition-colors ${
                        currentSection === item.section ? 'text-terminal-green' : 'text-terminal-text'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Help menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'Help' ? null : 'Help')}
              className="text-terminal-text hover:text-terminal-green transition-colors text-sm font-medium"
            >
              Help
            </button>
            <AnimatePresence>
              {activeMenu === 'Help' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 mt-1 bg-terminal-bg border border-terminal-border rounded-lg shadow-lg py-2 min-w-48"
                >
                  <button
                    onClick={() => onSectionChange('help')}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-terminal-green hover:text-black transition-colors text-terminal-text"
                  >
                    Portfolio Help
                  </button>
                  <div className="border-t border-terminal-border my-1"></div>
                  <div className="px-4 py-2 text-terminal-dim text-sm">Search...</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - status and controls */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Social quick links */}
          <a href="https://github.com/shubhhh19" target="_blank" rel="noreferrer" className="text-terminal-dim hover:text-terminal-green transition-colors" title="GitHub">
            <Github className="w-3 h-3 md:w-4 md:h-4" />
          </a>
          <a href="https://linkedin.com/in/shubhsoni" target="_blank" rel="noreferrer" className="text-terminal-dim hover:text-terminal-green transition-colors" title="LinkedIn">
            <Linkedin className="w-3 h-3 md:w-4 md:h-4" />
          </a>
          <a href="mailto:sonishubh2004@gmail.com" className="text-terminal-dim hover:text-terminal-green transition-colors" title="Email">
            <Mail className="w-3 h-3 md:w-4 md:h-4" />
          </a>
          {/* Current page label */}
          <div className="text-terminal-dim text-xs hidden sm:block">
            Online {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacMenuBar;