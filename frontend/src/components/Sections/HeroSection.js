import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';

const HeroSection = () => {
  const { portfolioData } = usePortfolio();
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  const heroData = portfolioData.hero?.content || {};
  
  const terminalLines = [
    '$ whoami',
    'Shubh Soni',
    '$ echo "Welcome to my terminal portfolio"',
    'Welcome to my terminal portfolio',
    '$ cat /about/me.txt',
    'Software Developer & Problem Solver',
    '$ ls -la /skills/',
    'Full Stack Development • AI/ML • Problem Solving',
    '$ ./portfolio --start'
  ];

  useEffect(() => {
    if (currentLineIndex < terminalLines.length) {
      const line = terminalLines[currentLineIndex];
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        setCurrentText(line.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex > line.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setCurrentLineIndex(prev => prev + 1);
            setCurrentText('');
          }, 800);
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    } else {
      setIsTyping(false);
    }
  }, [currentLineIndex, terminalLines]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Terminal Output Animation */}
      <GlassContainer variant="card" className="p-6">
        <div className="font-mono space-y-2">
          {terminalLines.slice(0, currentLineIndex).map((line, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={line.startsWith('$') ? 'text-terminal-green' : 'text-terminal-text'}
            >
              {line}
            </motion.div>
          ))}
          
          {currentLineIndex < terminalLines.length && (
            <div className={terminalLines[currentLineIndex]?.startsWith('$') ? 'text-terminal-green' : 'text-terminal-text'}>
              {currentText}
              {isTyping && <span className="terminal-cursor"></span>}
            </div>
          )}
        </div>
      </GlassContainer>

      {/* Developer Info Card */}
      {!isTyping && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <GlassContainer variant="strong" className="p-8">
            <div className="text-center space-y-4">
              {/* Avatar/Icon */}
              <div className="w-20 h-20 mx-auto bg-terminal-green bg-opacity-20 rounded-full flex items-center justify-center">
                <div className="text-terminal-green text-3xl font-bold">
                  S
                </div>
              </div>
              
              {/* Name & Title */}
              <div>
                <h1 className="text-2xl font-bold text-terminal-text mb-2">
                  Shubh Soni
                </h1>
                <p className="text-terminal-green text-lg">
                  Full Stack Developer & Problem Solver
                </p>
                <p className="text-terminal-dim mt-2">
                  Building innovative solutions with modern technologies
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex justify-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-terminal-blue font-semibold">Location</div>
                  <div className="text-terminal-text">Waterloo, ON</div>
                </div>
                <div className="text-center">
                  <div className="text-terminal-blue font-semibold">Status</div>
                  <div className="text-terminal-green">Available</div>
                </div>
                <div className="text-center">
                  <div className="text-terminal-blue font-semibold">Focus</div>
                  <div className="text-terminal-text">Full Stack</div>
                </div>
              </div>

              {/* Terminal Commands Hint */}
              <div className="pt-4 border-t border-white border-opacity-10">
                <p className="text-terminal-dim text-sm">
                  💡 Try commands: <span className="text-terminal-green">about</span>, <span className="text-terminal-green">skills</span>, <span className="text-terminal-green">projects</span>
                </p>
              </div>
            </div>
          </GlassContainer>
        </motion.div>
      )}

      {/* Floating Elements */}
      <div className="relative">
        {!isTyping && (
          <>
            <motion.div
              className="absolute -top-10 -right-4 w-8 h-8 border border-terminal-green opacity-30"
              animate={{ 
                rotate: 360,
                y: [0, -10, 0],
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            />
            <motion.div
              className="absolute -bottom-6 -left-6 w-6 h-6 border border-terminal-blue opacity-20 rounded-full"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};

export default HeroSection;