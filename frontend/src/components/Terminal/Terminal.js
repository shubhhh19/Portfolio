import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import TerminalPrompt from './TerminalPrompt';
import TerminalOutput from './TerminalOutput';
import HeroSection from '../Sections/HeroSection';
import AboutSection from '../Sections/AboutSection';
import SkillsSection from '../Sections/SkillsSection';
import ProjectsSection from '../Sections/ProjectsSection';
import ExperienceSection from '../Sections/ExperienceSection';
import ContactSection from '../Sections/ContactSection';
import HelpSection from '../Sections/HelpSection';
import { processCommand } from '../../utils/terminalCommands.js';

const Terminal = () => {
  const { portfolioData, skills, projects, experience, loading, isAdminMode, toggleAdminMode } = usePortfolio();
  
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState([]);
  const [currentSection, setCurrentSection] = useState('welcome');
  const [isTyping, setIsTyping] = useState(false);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  
  // Focus input when terminal is clicked
  useEffect(() => {
    const handleClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleClick);
      return () => terminal.removeEventListener('click', handleClick);
    }
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (!loading && portfolioData.hero) {
      const welcomeMessages = [
        'Portfolio Terminal v2.0.1 initialized...',
        'Loading developer profile...',
        '',
        'Welcome to Shubh Soni\'s terminal portfolio!',
        'Type "help" to see available commands.',
        'Type "whoami" to get started.',
        ''
      ];
      
      setOutput(welcomeMessages.map((msg, index) => ({
        id: index,
        type: 'system',
        content: msg,
        timestamp: new Date()
      })));
    }
  }, [loading, portfolioData.hero]);

  // Handle command execution
  const executeCommand = useCallback(async (command) => {
    const trimmedCommand = command.trim().toLowerCase();
    
    if (!trimmedCommand) return;

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to output
    setOutput(prev => [...prev, {
      id: Date.now(),
      type: 'command',
      content: `$ ${command}`,
      timestamp: new Date()
    }]);

    setIsTyping(true);
    
    // Process command
    const result = await processCommand(trimmedCommand, {
      portfolioData,
      skills,
      projects,
      experience,
      isAdminMode,
      toggleAdminMode,
      setCurrentSection
    });
    
    setTimeout(() => {
      setOutput(prev => [...prev, {
        id: Date.now() + 1,
        type: result.type,
        content: result.content,
        section: result.section,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 500);

  }, [portfolioData, skills, projects, experience, isAdminMode, toggleAdminMode]);

  // Handle input changes
  const handleInputChange = (e) => {
    setCurrentCommand(e.target.value);
  };

  // Handle key presses
  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (currentCommand.trim()) {
          executeCommand(currentCommand);
          setCurrentCommand('');
        }
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        if (commandHistory.length > 0) {
          const newIndex = historyIndex === -1 
            ? commandHistory.length - 1 
            : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex] || '');
        }
        break;
        
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex >= 0) {
          const newIndex = historyIndex < commandHistory.length - 1 
            ? historyIndex + 1 
            : -1;
          setHistoryIndex(newIndex);
          setCurrentCommand(newIndex === -1 ? '' : commandHistory[newIndex] || '');
        }
        break;
        
      case 'Tab':
        e.preventDefault();
        // Basic command auto-completion
        const commands = ['help', 'about', 'skills', 'projects', 'experience', 'contact', 'clear', 'whoami'];
        const matches = commands.filter(cmd => cmd.startsWith(currentCommand.toLowerCase()));
        if (matches.length === 1) {
          setCurrentCommand(matches[0]);
        }
        break;
        
      case 'c':
        if (e.ctrlKey) {
          e.preventDefault();
          setCurrentCommand('');
        }
        break;
        
      case 'l':
        if (e.ctrlKey) {
          e.preventDefault();
          executeCommand('clear');
        }
        break;
    }
  };

  // Clear terminal
  useEffect(() => {
    const clearCommand = output.find(item => item.type === 'system' && item.content === 'clear');
    if (clearCommand) {
      setOutput([]);
      setCurrentSection('welcome');
    }
  }, [output]);

  // Scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-terminal-green font-mono text-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-terminal-green border-t-transparent rounded-full"></div>
            <span>Loading portfolio data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={terminalRef}
      className="h-full bg-transparent overflow-y-auto overflow-x-hidden cursor-text p-4 font-mono text-sm"
    >
      {/* Terminal Output */}
      <div className="min-h-0 mb-4">
        <AnimatePresence>
          {output.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TerminalOutput 
                item={item} 
                currentSection={currentSection}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-terminal-green"
          >
            Processing<span className="loading-dots"></span>
          </motion.div>
        )}
      </div>

      {/* Terminal Prompt */}
      <div className="flex items-center space-x-2 text-terminal-text">
        <span className="text-terminal-green font-semibold">
          {isAdminMode ? 'admin@portfolio' : 'guest@portfolio'}
        </span>
        <span className="text-terminal-blue">~</span>
        <span className="text-terminal-green">$</span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-terminal-text font-mono caret-terminal-green"
          placeholder="Type a command..."
          autoFocus
        />
        <span className="terminal-cursor"></span>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-4 right-4 text-xs text-terminal-dim bg-black bg-opacity-50 px-3 py-1 rounded">
        {isAdminMode ? '🔧 ADMIN MODE' : '👤 GUEST MODE'} | 
        {commandHistory.length} commands | 
        {currentSection.toUpperCase()}
      </div>
    </div>
  );
};

export default Terminal;