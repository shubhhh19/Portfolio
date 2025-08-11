import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { Terminal, Code, Database, Cloud, Settings, Star } from 'lucide-react';

const SkillsSection = () => {
  const { skills } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);

  const categories = [
    { key: 'all', label: 'All Skills', icon: '🎯', color: 'text-terminal-text' },
    { key: 'languages', label: 'Languages', icon: '💻', color: 'text-terminal-green' },
    { key: 'frameworks', label: 'Frameworks', icon: '⚛️', color: 'text-terminal-blue' },
    { key: 'databases', label: 'Databases', icon: '🗄️', color: 'text-terminal-purple' },
    { key: 'cloud', label: 'Cloud', icon: '☁️', color: 'text-terminal-yellow' },
    { key: 'tools', label: 'Tools', icon: '🛠️', color: 'text-terminal-red' },
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      languages: Code,
      frameworks: Terminal,
      databases: Database,
      cloud: Cloud,
      tools: Settings,
    };
    return icons[category] || Code;
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

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
            <span className="text-terminal-green">$</span> ls -la /tech-stack/
          </div>
          <div className="text-terminal-dim text-sm">
            total {skills.length} items • Categories: {categories.length - 1}
          </div>
        </div>
      </GlassContainer>

      {/* Category Filter */}
      <GlassContainer variant="strong" className="p-6">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category, index) => (
            <motion.button
              key={category.key}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedCategory(category.key)}
              className={`
                px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center space-x-2
                ${selectedCategory === category.key 
                  ? 'bg-terminal-green bg-opacity-20 border border-terminal-green text-terminal-green shadow-glow-green' 
                  : 'glass-card hover:bg-opacity-10 text-terminal-text hover:text-terminal-green'
                }
              `}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
              {category.key !== 'all' && (
                <span className="text-xs bg-terminal-header px-2 py-1 rounded">
                  {skills.filter(s => s.category === category.key).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </GlassContainer>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredSkills.map((skill, index) => {
            const IconComponent = getCategoryIcon(skill.category);
            
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onHoverStart={() => setHoveredSkill(skill.id)}
                onHoverEnd={() => setHoveredSkill(null)}
              >
                <GlassContainer 
                  variant="card" 
                  className={`
                    p-6 h-full transition-all duration-300 cursor-pointer
                    ${hoveredSkill === skill.id ? 'scale-105 shadow-glow-green' : ''}
                  `}
                >
                  <div className="space-y-4">
                    {/* Skill Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-terminal-green bg-opacity-10 rounded-lg">
                          <IconComponent className="w-5 h-5 text-terminal-green" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-terminal-text">
                            {skill.name}
                          </h3>
                          <span className="text-xs text-terminal-dim uppercase tracking-wide">
                            {skill.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Experience Years */}
                    {skill.years_experience && (
                      <div className="text-xs text-terminal-dim">
                        📅 {skill.years_experience} year{skill.years_experience !== 1 ? 's' : ''} experience
                      </div>
                    )}

                    {/* Floating Animation */}
                    {hoveredSkill === skill.id && (
                      <motion.div
                        className="absolute -top-2 -right-2 w-4 h-4 bg-terminal-green rounded-full opacity-60"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </div>
                </GlassContainer>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Skills Summary */}
      <GlassContainer variant="card" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Most Proficient */}
          <div className="text-center">
            <h3 className="text-terminal-green font-semibold mb-2">🏆 Expert Level</h3>
            <div className="space-y-1">
              {skills
                .filter(skill => skill.proficiency >= 4)
                .slice(0, 3)
                .map(skill => (
                  <div key={skill.id} className="text-sm text-terminal-text">
                    {skill.name}
                  </div>
                ))
              }
            </div>
          </div>

          {/* Learning */}
          <div className="text-center">
            <h3 className="text-terminal-blue font-semibold mb-2">📚 Learning</h3>
            <div className="space-y-1">
              {skills
                .filter(skill => skill.proficiency <= 2)
                .slice(0, 3)
                .map(skill => (
                  <div key={skill.id} className="text-sm text-terminal-text">
                    {skill.name}
                  </div>
                ))
              }
            </div>
          </div>

          {/* Total Count */}
          <div className="text-center">
            <h3 className="text-terminal-yellow font-semibold mb-2">📊 Overview</h3>
            <div className="text-sm text-terminal-text space-y-1">
              <div>{skills.length} Total Skills</div>
              <div>{categories.length - 1} Categories</div>
              <div>Always Growing 🚀</div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Terminal Footer */}
      <GlassContainer variant="card" className="p-4">
        <div className="font-mono text-terminal-dim text-sm text-center">
          💡 Interested in my work? Try: <code className="text-terminal-green">projects</code> or <code className="text-terminal-green">experience</code>
        </div>
      </GlassContainer>

      {/* Floating Skill Icons */}
      <div className="relative">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-6 h-6 opacity-10 text-terminal-green`}
            style={{
              left: `${20 + i * 30}%`,
              top: `${-50 - i * 20}px`,
            }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3 + i, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 10 + i * 5, repeat: Infinity, ease: "linear" },
            }}
          >
            <Code className="w-full h-full" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SkillsSection;