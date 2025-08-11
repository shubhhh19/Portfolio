import React from 'react';

const TerminalPrompt = ({ isAdminMode = false }) => {
  return (
    <div className="flex items-center space-x-2 text-terminal-text font-mono">
      <span className="text-terminal-green font-semibold">
        {isAdminMode ? 'admin@portfolio' : 'guest@portfolio'}
      </span>
      <span className="text-terminal-blue">~</span>
      <span className="text-terminal-green">$</span>
    </div>
  );
};

export default TerminalPrompt;