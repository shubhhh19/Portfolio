import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { Briefcase, Calendar, MapPin, ExternalLink, ChevronDown, ChevronRight, GitBranch } from 'lucide-react';

const ExperienceSection = () => {
  const { experience } = usePortfolio();
  const [expandedExp, setExpandedExp] = useState(null);

  // Default experience if none provided
  const defaultExperience = [
    {
      id: '1',
      title: 'Software Developer',
      company: 'Freelance',
      location: 'Remote',
      start_date: 'Jan 2023',
      end_date: null,
      is_current: true,
      description: 'Full-stack web development for various clients, specializing in React, Node.js, and modern web technologies. Built scalable applications and delivered high-quality solutions.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker']
    },
    {
      id: '2',
      title: 'Software Engineering Tutor',
      company: 'Private Tutoring',
      location: 'Remote/In-Person',
      start_date: 'May 2023',
      end_date: 'Dec 2023',
      is_current: false,
      description: 'Provided personalized coding instruction and mentorship to students learning programming fundamentals and advanced concepts.',
      technologies: ['Python', 'JavaScript', 'Java', 'Data Structures']
    },
    {
      id: '3',
      title: 'Discord Server Developer',
      company: 'EsportsHub',
      location: 'Remote',
      start_date: 'Jan 2021',
      end_date: 'Dec 2021',
      is_current: false,
      description: 'Developed and maintained Discord bot applications and server automation tools for gaming communities.',
      technologies: ['Discord.js', 'Node.js', 'MongoDB']
    }
  ];

  const experienceData = experience.length > 0 ? experience : defaultExperience;

  const ExperienceCard = ({ exp, index, isExpanded, onToggle }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline Line */}
      {index < experienceData.length - 1 && (
        <div className="absolute left-6 top-20 w-0.5 h-20 bg-terminal-green bg-opacity-30"></div>
      )}
      
      {/* Timeline Dot */}
      <div className="absolute left-4 top-8 w-4 h-4 bg-terminal-green rounded-full border-2 border-terminal-dark">
        <div className="absolute inset-1 bg-terminal-green rounded-full animate-pulse"></div>
      </div>

      <GlassContainer variant="card" className="ml-12 mb-6 p-6 cursor-pointer transition-all duration-300 hover:shadow-glow-green">
        <div
          className="flex items-start justify-between"
          onClick={() => onToggle(exp.id)}
        >
          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold text-terminal-text">
                    {exp.title}
                  </h3>
                  {exp.is_current && (
                    <span className="px-2 py-1 bg-terminal-green bg-opacity-20 text-terminal-green text-xs rounded-full">
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4 mt-1 text-sm text-terminal-dim">
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-terminal-green">{exp.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm">
                  <div className="flex items-center text-terminal-text">
                    <Calendar className="w-4 h-4 mr-1" />
                    {exp.start_date}
                  </div>
                  <div className="text-terminal-dim">
                    {exp.end_date || 'Present'}
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-5 h-5 text-terminal-green" />
                </motion.div>
              </div>
            </div>

            {/* Tech Stack Preview */}
            <div className="flex flex-wrap gap-2">
              {exp.technologies?.slice(0, 3).map((tech, techIndex) => (
                <span key={techIndex} className="tech-badge text-xs">
                  {tech}
                </span>
              ))}
              {exp.technologies?.length > 3 && (
                <span className="text-xs text-terminal-dim">
                  +{exp.technologies.length - 3} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 space-y-4 border-t border-white border-opacity-10 pt-4"
            >
              {/* Description */}
              <p className="text-terminal-text leading-relaxed">
                {exp.description}
              </p>

              {/* All Technologies */}
              {exp.technologies && exp.technologies.length > 3 && (
                <div>
                  <h4 className="text-sm font-semibold text-terminal-green mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="tech-badge text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassContainer>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      {/* Terminal Header */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono space-y-1">
          <div className="text-terminal-green">
            <span className="text-terminal-green">$</span> git log --oneline --graph
          </div>
          <div className="text-terminal-dim text-sm">
            * Professional journey with {experienceData.length} major milestones
          </div>
        </div>
      </GlassContainer>

      {/* Experience Timeline */}
      <div className="relative">
        {experienceData.map((exp, index) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            index={index}
            isExpanded={expandedExp === exp.id}
            onToggle={(id) => setExpandedExp(expandedExp === id ? null : id)}
          />
        ))}
      </div>

      {/* Experience Summary */}
      <GlassContainer variant="strong" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-green mb-6 flex items-center">
          <GitBranch className="w-5 h-5 mr-2" />
          Experience Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Domains */}
          <div className="text-center">
            <motion.div className="text-3xl font-bold text-terminal-green mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>Full‑Stack</motion.div>
            <div className="text-terminal-text font-semibold">Primary Focus</div>
            <div className="text-sm text-terminal-dim">Frontend + Backend + CI/CD</div>
          </div>
          {/* Impact */}
          <div className="text-center">
            <motion.div className="text-3xl font-bold text-terminal-blue mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>Automation</motion.div>
            <div className="text-terminal-text font-semibold">Developer Productivity</div>
            <div className="text-sm text-terminal-dim">Scripts, pipelines, tooling</div>
          </div>
          {/* Community */}
          <div className="text-center">
            <motion.div className="text-3xl font-bold text-terminal-yellow mb-2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>Projects</motion.div>
            <div className="text-terminal-text font-semibold">Completed</div>
            <div className="text-sm text-terminal-dim">Web & Mobile Apps</div>
          </div>
        </div>
      </GlassContainer>

      {/* Career Highlights */}
      <GlassContainer variant="card" className="p-6">
        <h2 className="text-lg font-semibold text-terminal-green mb-4">
          🏆 Career Highlights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'AI & Automation', description: 'Integrated LLMs and automated reviews, testing and deployments', icon: '🤖' },
            { title: 'System Design', description: 'Designed REST APIs, data models, and cloud‑ready services', icon: '🧩' },
            { title: 'Performance', description: 'Optimized queries and front‑end rendering for speed and UX', icon: '⚡' },
            { title: 'Continuous Learning', description: 'Always adapting to new technologies and methodologies', icon: '📚' },
          ].map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 glass-card rounded"
            >
              <span className="text-2xl">{highlight.icon}</span>
              <div>
                <h3 className="font-semibold text-terminal-text">{highlight.title}</h3>
                <p className="text-sm text-terminal-dim">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </GlassContainer>

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Interested in working together? Try: <code className="text-terminal-green">contact</code> or see my <code className="text-terminal-green">projects</code>
        </div>
      </GlassContainer>

      {/* Floating Git Icons */}
      <div className="relative">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-5 h-5 opacity-10 text-terminal-green"
            style={{
              right: `${10 + i * 20}%`,
              top: `${-40 - i * 20}px`,
            }}
            animate={{
              y: [0, -12, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 12 + i * 3, repeat: Infinity, ease: "linear" },
            }}
          >
            <GitBranch className="w-full h-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExperienceSection;