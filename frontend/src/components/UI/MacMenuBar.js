import React from 'react';
import { usePortfolio } from '../../context/PortfolioContext';

const MacMenuBar = ({ currentSection, setCurrentSection }) => {
  const { isAdminMode } = usePortfolio();

  // Base menu items that are always visible
  const baseMenu = [
    { label: 'Home', section: 'home' },
    { label: 'About', section: 'about' },
    { label: 'Skills', section: 'skills' },
    { label: 'Projects', section: 'projects' },
    { label: 'Experience', section: 'experience' },
    { label: 'Contact', section: 'contact' },
    { label: 'Help', section: 'help' },
  ];

  // Admin entry shows only when user is authenticated as admin
  const menuItems = isAdminMode ? [...baseMenu, { label: 'Admin', section: 'admin' }] : baseMenu;

  // Window dropdown removed per request

  const handleMenuClick = (item) => {
    if (item.section) {
      setCurrentSection(item.section);
    } else if (item.items) {
      // This case is not handled in the new_code, so it will be removed.
      // The original code had a similar logic for submenus, but the new_code
      // simplified the menu structure to only show the admin item if authenticated.
      // Therefore, submenu logic is removed.
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

          {/* Window dropdown removed */}
        </div>

        {/* Right side - Status */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Social quick links */}
          {/* Removed social quick links per request */}
          {/* Removed current page label per request */}
          {/* Removed toggle terminal button per request */}
        </div>
      </div>
    </div>
  );
};

export default MacMenuBar;