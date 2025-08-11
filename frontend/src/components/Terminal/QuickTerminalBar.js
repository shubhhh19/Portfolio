import React, { useCallback, useEffect, useRef, useState } from 'react';
import GlassContainer from '../UI/GlassContainer';
import { usePortfolio } from '../../context/PortfolioContext';
import { processCommand } from '../../utils/terminalCommands';

// A compact terminal bar that is always visible for quick commands
const QuickTerminalBar = ({ onHelp, onNavigate }) => {
  const { portfolioData, skills, projects, experience, isAdminMode, toggleAdminMode } = usePortfolio();

  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState('');
  const [lastOutputs, setLastOutputs] = useState([]); // keep last few lines only

  const inputRef = useRef(null);

  const executeCommand = useCallback(async (command) => {
    const trimmed = command.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);

    // Append the command itself to output
    setLastOutputs(prev => [
      ...prev.slice(-2),
      { id: Date.now(), type: 'command', content: `$ ${trimmed}` }
    ]);

    try {
      const result = await processCommand(trimmed.toLowerCase(), {
        portfolioData,
        skills,
        projects,
        experience,
        isAdminMode,
        toggleAdminMode,
        setCurrentSection: onNavigate || (() => {})
      });

      const text = typeof result?.content === 'string'
        ? result.content
        : (result?.section ? `Opened ${result.section}` : 'Command executed');

      setLastOutputs(prev => [
        ...prev.slice(-2),
        { id: Date.now() + 1, type: result?.type || 'system', content: text }
      ]);
    } catch (e) {
      setLastOutputs(prev => [
        ...prev.slice(-2),
        { id: Date.now() + 2, type: 'error', content: 'Command failed' }
      ]);
    }
  }, [portfolioData, skills, projects, experience, isAdminMode, toggleAdminMode]);

  useEffect(() => {
    // Autofocus when mounted
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const onKeyDown = (e) => {
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
          const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex] || '');
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (historyIndex >= 0) {
          const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : -1;
          setHistoryIndex(newIndex);
          setCurrentCommand(newIndex === -1 ? '' : commandHistory[newIndex] || '');
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="fixed left-2 md:left-4 right-2 md:right-4 bottom-2 md:bottom-4 z-[60] pointer-events-none">
      <GlassContainer variant="card" className="pointer-events-auto p-2 bg-terminal-header bg-opacity-90 backdrop-blur-md border border-terminal-green border-opacity-30">
                  <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm font-mono">
          <div className="hidden md:flex items-center gap-2 text-terminal-dim">
            {lastOutputs.slice(-2).map(line => (
              <div key={line.id} className="truncate max-w-[18rem] md:max-w-[24rem]">
                <span className={line.type === 'error' ? 'text-red-400' : 'text-terminal-green'}>
                  {line.type === 'command' ? '' : '>'} 
                </span>
                <span className="text-terminal-text">{line.content}</span>
              </div>
            ))}
          </div>

          <div className="flex-1 flex items-center gap-2 text-terminal-text relative">
            <span className="text-terminal-green">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Type a command... (try: help, projects, skills)"
              className="flex-1 bg-transparent outline-none placeholder-terminal-dim caret-terminal-green"
            />
            <button
              onClick={() => {
                if (onHelp) onHelp();
                if (onNavigate) onNavigate('help');
                executeCommand('help');
              }}
              className="absolute right-1 md:right-2 bottom-1/2 translate-y-1/2 text-xs px-1 md:px-2 py-1 rounded bg-terminal-green/10 text-terminal-green border border-terminal-green/30 hover:bg-terminal-green/20 transition-colors"
              title="Help"
            >
              help
            </button>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default QuickTerminalBar;


