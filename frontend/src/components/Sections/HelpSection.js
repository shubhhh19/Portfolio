import React from 'react';
import { motion } from 'framer-motion';
import GlassContainer from '../UI/GlassContainer';
import { usePortfolio } from '../../context/PortfolioContext';

const HelpSection = () => {
  const { isAdminMode } = usePortfolio();

  const commands = [
    {
      command: 'whoami',
      description: 'Display developer information and welcome message',
      category: 'info'
    },
    {
      command: 'about',
      description: 'Show detailed background and education',
      category: 'info'
    },
    {
      command: 'skills',
      description: 'List technical skills and proficiencies',
      category: 'portfolio'
    },
    {
      command: 'projects',
      description: 'Display portfolio projects with links',
      category: 'portfolio'
    },
    {
      command: 'experience',
      description: 'Show work experience timeline',
      category: 'portfolio'
    },
    {
      command: 'contact',
      description: 'Display contact information and social links',
      category: 'info'
    },
    {
      command: 'clear',
      description: 'Clear the terminal screen',
      category: 'system'
    },
    {
      command: 'ls',
      description: 'List available sections and files',
      category: 'system'
    },
    {
      command: 'cat about.txt',
      description: 'Display about section (same as "about")',
      category: 'system'
    },
    {
      command: 'git log',
      description: 'Show experience timeline in git format',
      category: 'system'
    },
    {
      command: 'sudo admin',
      description: 'Toggle admin mode for content editing',
      category: 'admin'
    },
  ];

  const keyboardShortcuts = [
    { key: '↑/↓', description: 'Navigate command history' },
    { key: 'Tab', description: 'Auto-complete commands' },
    { key: 'Ctrl+C', description: 'Clear current input' },
    { key: 'Ctrl+L', description: 'Clear terminal screen' },
  ];

  const categoryColors = {
    info: 'text-terminal-blue',
    portfolio: 'text-terminal-green',
    system: 'text-terminal-yellow',
    admin: 'text-terminal-purple'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Terminal Header */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono space-y-1">
          <div className="text-terminal-green">
            <span className="text-terminal-green">$</span> help --all
          </div>
          <div className="text-terminal-dim text-sm">
            * Displaying all available commands and shortcuts
          </div>
        </div>
      </GlassContainer>

      {/* Header */}
      <GlassContainer variant="card" className="p-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-terminal-green">Terminal Portfolio Help</h1>
          <p className="text-terminal-dim">
            Available commands and keyboard shortcuts
          </p>
        </div>
      </GlassContainer>

      {/* Commands */}
      <GlassContainer variant="strong" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-text mb-4 flex items-center">
          <span className="mr-2">📋</span>
          Available Commands
        </h2>
        
        <div className="grid gap-3">
          {commands.map((cmd, index) => (
            <motion.div
              key={cmd.command}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-start space-x-4 p-3 rounded glass-card hover:bg-opacity-10"
            >
              <code className={`font-mono font-semibold min-w-0 flex-shrink-0 ${categoryColors[cmd.category]}`}>
                {cmd.command}
              </code>
              <span className="text-terminal-text text-sm flex-1">
                {cmd.description}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${categoryColors[cmd.category]} bg-opacity-20`}>
                {cmd.category.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassContainer>

      {/* Keyboard Shortcuts */}
      <GlassContainer variant="card" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-text mb-4 flex items-center">
          <span className="mr-2">⌨️</span>
          Keyboard Shortcuts
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {keyboardShortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center space-x-3 p-3 glass-card rounded"
            >
              <kbd className="bg-terminal-header px-2 py-1 rounded text-terminal-green font-mono text-sm">
                {shortcut.key}
              </kbd>
              <span className="text-terminal-text text-sm">
                {shortcut.description}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassContainer>

      {/* Tips & Features */}
      <GlassContainer variant="card" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-text mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Tips & Features
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-2"
            >
              <h3 className="font-semibold text-terminal-blue">🎯 Navigation</h3>
              <ul className="text-sm text-terminal-text space-y-1">
                <li>• Commands are case-insensitive</li>
                <li>• Use Tab for auto-completion</li>
                <li>• Access command history with arrows</li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-2"
            >
              <h3 className="font-semibold text-terminal-green">⚡ Features</h3>
              <ul className="text-sm text-terminal-text space-y-1">
                <li>• Real-time 3D background effects</li>
                <li>• Glass morphism design</li>
                <li>• Responsive terminal interface</li>
              </ul>
            </motion.div>
          </div>
          
          {isAdminMode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-4 bg-terminal-purple bg-opacity-10 rounded border border-terminal-purple border-opacity-30"
            >
              <h3 className="font-semibold text-terminal-purple mb-2">🔧 Admin Mode Active</h3>
              <p className="text-sm text-terminal-text">
                You're currently in admin mode. Content editing features will be available soon.
                Use <code className="text-terminal-green">"sudo admin"</code> to toggle back to guest mode.
              </p>
            </motion.div>
          )}
        </div>
      </GlassContainer>

      {/* Easter Eggs */}
      <GlassContainer variant="card" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-text mb-4 flex items-center">
          <span className="mr-2">🎮</span>
          Hidden Commands
        </h2>
        
        <div className="text-sm text-terminal-dim">
          <p>Try typing: <code className="text-terminal-green">matrix</code>, <code className="text-terminal-green">coffee</code>, <code className="text-terminal-green">exit</code></p>
          <p className="mt-2">Discover more easter eggs by experimenting! 🕵️</p>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default HelpSection;