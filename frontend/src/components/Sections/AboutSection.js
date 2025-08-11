import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { User, MapPin, Mail, GraduationCap, Calendar, FileText } from 'lucide-react';

const AboutSection = () => {
  const { portfolioData } = usePortfolio();
  const aboutData = portfolioData.about?.content || {};

  const stats = [
    { label: 'Years Coding', value: '5+', icon: '💻' },
    { label: 'Projects Built', value: '20+', icon: '🚀' },
    { label: 'Technologies', value: '15+', icon: '⚡' },
    { label: 'Coffee Cups', value: '∞', icon: '☕' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Terminal Header */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-green">
          <span className="text-terminal-green">$</span> cat about.txt
        </div>
      </GlassContainer>

      {/* Main About Card */}
      <GlassContainer variant="strong" className="p-8">
        <div className="space-y-6">
          {/* Personal Info Header */}
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-terminal-green/10 flex items-center justify-center relative">
              <img
                src="/pfp.png"
                alt="Shubh Soni"
                className="w-full h-full object-cover"
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              {/* Fallback */}
              <span className="absolute text-3xl text-terminal-green" style={{ display: 'none' }}>S</span>
            </div>
            
            <div className="flex-1 space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold text-terminal-text flex items-center gap-2">
                    <User className="w-5 h-5 mr-2 text-terminal-green" />
                    Shubh Soni
                  </h1>
                  <a
                    href="https://shubhhh19.github.io/shubhhh19/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-terminal-green bg-opacity-20 border border-terminal-green text-terminal-green rounded-lg hover:bg-opacity-30 hover:text-terminal-text transition-all duration-300"
                    title="Open Resume"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-mono">Resume</span>
                  </a>
                </div>
                <p className="text-terminal-green font-mono">Software Developer</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-terminal-text">
                  <MapPin className="w-4 h-4 mr-2 text-terminal-blue" />
                  Waterloo, ON, Canada
                </div>
                <div className="flex items-center text-terminal-text">
                  <Mail className="w-4 h-4 mr-2 text-terminal-blue" />
                  sonishubh2004@gmail.com
                </div>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-4">
            {/* About summary removed on dashboard request; keeping short bio here */}
            <h2 className="text-lg font-semibold text-terminal-green border-b border-terminal-green border-opacity-30 pb-2">
              Summary
            </h2>
            <p className="text-terminal-text leading-relaxed">
              Experienced full‑stack developer and automation engineer focused on crafting reliable, scalable products.
              I combine clean, user‑centric experiences with robust back‑end systems, CI/CD, and cloud infrastructure.
              Professional experience includes building end‑to‑end features, integrating third‑party APIs, and improving developer tooling.
            </p>
            <div className="mt-4 p-3 bg-terminal-green bg-opacity-10 border border-terminal-green border-opacity-30 rounded-lg">
              <h4 className="text-terminal-green font-semibold mb-2 flex items-center">
                <span className="mr-2">🚀</span>75-Day Challenge
              </h4>
              <p className="text-terminal-text text-sm leading-relaxed">
                Currently pursuing a daily coding and learning challenge: 2 LeetCode problems daily (NeetCode roadmap) 
                plus researching one tool/technology daily with honest write-ups on LinkedIn.
              </p>
              <a 
                href="https://linkedin.com/in/shubhsoni" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center mt-2 text-terminal-blue hover:text-terminal-green transition-colors text-xs"
              >
                Follow my progress →
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-terminal-green border-b border-terminal-green border-opacity-30 pb-2">
              Education
            </h2>
            <div className="flex items-start space-x-4">
              <GraduationCap className="w-6 h-6 text-terminal-blue mt-1" />
              <div>
                <h3 className="font-semibold text-terminal-text">
                  Software Engineering Technology
                </h3>
                <p className="text-terminal-dim">
                  Conestoga College, Waterloo
                </p>
                <p className="text-terminal-green text-sm flex items-center mt-1">
                  <Calendar className="w-4 h-4 mr-1" />
                  Jan 2023 - April 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <GlassContainer variant="card" className="p-4 text-center hover:scale-105 transition-transform">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-lg font-bold text-terminal-green">{stat.value}</div>
              <div className="text-sm text-terminal-dim">{stat.label}</div>
            </GlassContainer>
          </motion.div>
        ))}
      </div>

      {/* Personal Interests removed per request */}

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Want to know more? Try: <code className="text-terminal-green">skills</code> or <code className="text-terminal-green">experience</code>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default AboutSection;