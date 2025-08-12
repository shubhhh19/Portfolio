import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';

const MacMenuBar = ({ currentSection, onSectionChange, onTerminalToggle, isTerminalOpen, onWindowAction }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  // Admin entry shows only when localStorage flag is set by admin mode
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('admin_mode') === 'true';

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
    { label: 'About', section: 'about' },
    { label: 'Projects', section: 'projects' },
    { label: 'Skills & Tech', section: 'skills' },
    { label: 'Experience', section: 'experience' },
    { label: 'Education', section: 'education' },
    { label: 'Contact', section: 'contact' },
    { label: 'Resume', section: 'resume' },
  ];
  const menuItems = isAdmin ? [...baseMenu, { label: 'Admin', section: 'admin' }] : baseMenu;

  // Window dropdown removed per request

  const handleMenuClick = (item) => {
    if (item.section) {
      onSectionChange(item.section);
      setActiveMenu(null);
    } else if (item.items) {
      setActiveMenu(activeMenu === item.label ? null : item.label);
    }
  };

  return (
    <div className="bg-terminal-header bg-opacity-90 backdrop-blur-md border-b border-terminal-green border-opacity-30 sticky top-0 z-[70]">
      <div className="flex items-center justify-between px-2 md:px-4 py-2">
        {/* Left side - Menu items */}
        <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto no-scrollbar">
          <div className="text-terminal-green font-mono text-xs md:text-sm hidden md:block mr-1">$ portfolio</div>
          {menuItems.map((item) => (
            <div key={item.label} className="relative">
              <button
                onClick={() => handleMenuClick(item)}
                className={`flex items-center space-x-1 px-2 md:px-3 py-1 rounded hover:bg-terminal-green hover:bg-opacity-20 transition-all duration-200 text-terminal-text ${
                  currentSection === item.section ? 'text-terminal-green' : ''
                }`}
              >
                <span className="text-xs md:text-sm font-medium">{item.label}</span>
              </button>
            </div>
          ))}
        </div>

        {/* Right side - Status */}
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
        </div>
      </div>
    </div>
  );
};

export default MacMenuBar;