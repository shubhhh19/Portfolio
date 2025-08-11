import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassContainer from '../UI/GlassContainer';
import { Coffee, Zap, GamepadIcon, Heart, Sparkles, Rocket } from 'lucide-react';

const FunCommands = () => {
  const [executedCommand, setExecutedCommand] = useState(null);

  const funCommands = [
    {
      command: 'matrix',
      icon: Zap,
      description: 'Enter the Matrix',
      color: 'text-terminal-green',
      response: 'Wake up, Neo... 🕶️'
    },
    {
      command: 'coffee',
      icon: Coffee,
      description: 'Virtual coffee break',
      color: 'text-terminal-yellow',
      response: '☕ Brewing coffee... This developer runs on caffeine!'
    },
    {
      command: 'konami',
      icon: GamepadIcon,
      description: 'Konami code magic',
      color: 'text-terminal-purple',
      response: '🎮 ↑↑↓↓←→←→BA - Cheat mode activated!'
    },
    {
      command: 'love',
      icon: Heart,
      description: 'Spread the love',
      color: 'text-terminal-red',
      response: '❤️ Made with love and lots of code!'
    },
    {
      command: 'magic',
      icon: Sparkles,
      description: 'Cast a spell',
      color: 'text-terminal-blue',
      response: '✨ Abracadabra! Your code is now bug-free!'
    },
    {
      command: 'rocket',
      icon: Rocket,
      description: 'Launch something',
      color: 'text-terminal-green',
      response: '🚀 To infinity and beyond!'
    }
  ];

  const executeCommand = (cmd) => {
    setExecutedCommand(cmd);
    setTimeout(() => setExecutedCommand(null), 3000);
  };

  return (
    <GlassContainer variant="strong" className="h-full bg-terminal-dark bg-opacity-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 bg-terminal-header bg-opacity-90 backdrop-blur-md border-b border-terminal-green border-opacity-30">
          <h3 className="text-terminal-green text-sm font-semibold flex items-center">
            <GamepadIcon className="w-4 h-4 mr-2" />
            Fun Commands
          </h3>
        </div>

        {/* Commands Grid */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {funCommands.map((cmd, index) => {
              const IconComponent = cmd.icon;
              return (
                <motion.button
                  key={cmd.command}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => executeCommand(cmd)}
                  className={`
                    glass-card p-2 rounded-lg text-xs transition-all duration-200 hover:bg-opacity-20
                    ${cmd.color} hover:scale-105 group text-center border border-terminal-green border-opacity-20
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconComponent className="w-4 h-4 mx-auto mb-1 group-hover:animate-bounce" />
                  <div className="font-mono font-semibold text-xs">{cmd.command}</div>
                  <div className="text-terminal-dim mt-1 text-xs leading-tight">
                    {cmd.description}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Response Area */}
          <AnimatePresence>
            {executedCommand && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.9 }}
                className="mt-4 p-3 glass-card rounded-lg text-center"
              >
                <div className={`text-sm font-mono ${executedCommand.color}`}>
                  $ {executedCommand.command}
                </div>
                <div className="text-terminal-text text-sm mt-1">
                  {executedCommand.response}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tip */}
          <div className="mt-4 text-center">
            <div className="text-terminal-dim text-xs">
              💡 Try typing these in the terminal above!
            </div>
          </div>
        </div>
      </div>
    </GlassContainer>
  );
};

export default FunCommands;