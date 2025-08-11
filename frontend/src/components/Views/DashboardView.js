import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import GlassContainer from '../UI/GlassContainer';
import { User, Code, Briefcase, Mail, Star, ExternalLink, Github, ThumbsUp, Lightbulb, Calendar, Coffee, UserCheck, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardView = ({ onSectionChange }) => {
  const { portfolioData, skills, projects, experience } = usePortfolio();

  const featuredProjects = projects && projects.length > 0 ? projects.filter(p => p.featured).slice(0, 3) : [];
  // Interactive skills panel state
  const [skillQuery, setSkillQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSkillIds, setSelectedSkillIds] = useState(new Set());

  const categories = useMemo(() => (
    ['languages', 'frameworks', 'databases', 'cloud', 'tools']
  ), []);

  const filteredSkills = useMemo(() => {
    let list = skills || [];
    if (selectedCategory !== 'all') {
      list = list.filter(s => s.category === selectedCategory);
    }
    if (skillQuery.trim()) {
      const q = skillQuery.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }
    return list;
  }, [skills, skillQuery, selectedCategory]);

  const toggleSkill = (id) => {
    setSelectedSkillIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Recent activity (projects + experience)
  const recentActivity = (() => {
    const projectEvents = (projects || []).map(p => ({
      type: 'project',
      title: p.title,
      date: p.created_at || '0000-00-00',
    }));
    const expEvents = (experience || []).map(e => ({
      type: 'experience',
      title: e.title,
      date: e.start_date || '0000-00-00',
    }));
    const parseDate = (d) => {
      // Try ISO first else fall back to Year-only
      const iso = Date.parse(d);
      if (!Number.isNaN(iso)) return new Date(iso).getTime();
      const match = /\b(20\d{2}|19\d{2})\b/.exec(String(d));
      return match ? new Date(parseInt(match[1], 10), 0, 1).getTime() : 0;
    };
    return [...projectEvents, ...expEvents]
      .sort((a, b) => parseDate(b.date) - parseDate(a.date))
      .slice(0, 6);
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <GlassContainer variant="card" className="p-4 md:p-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-terminal-text">Shubh Soni</h1>
        <div className="mt-1 text-terminal-green font-mono text-sm md:text-base">Software Engineer</div>
        <div className="mt-1 text-terminal-dim font-mono text-xs md:text-sm">{'<Code, Automate, Innovate>'}</div>
      </GlassContainer>
      {/* Terminal Header removed to maximize vertical space */}

      {/* Welcome header removed for tighter dashboard fit */}

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassContainer variant="card" className="p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-terminal-dim">Years Coding</div>
            <div className="text-lg font-semibold text-terminal-text">5+</div>
          </div>
          <Calendar className="w-5 h-5 text-terminal-green" />
        </GlassContainer>
        <GlassContainer variant="card" className="p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-terminal-dim">Open to Work</div>
            <div className="text-lg font-semibold text-terminal-green">Available</div>
          </div>
          <UserCheck className="w-5 h-5 text-terminal-green" />
        </GlassContainer>
        <GlassContainer variant="card" className="p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-terminal-dim">Coffee</div>
            <div className="text-lg font-semibold text-terminal-text">∞</div>
          </div>
          <Coffee className="w-5 h-5 text-terminal-green" />
        </GlassContainer>
        <GlassContainer variant="card" className="p-3 flex items-center justify-between">
          <div>
            <div className="text-xs text-terminal-dim">Socials</div>
            <div className="flex items-center gap-3">
              <a href="https://github.com/shubhhh19" target="_blank" rel="noreferrer" className="text-terminal-dim hover:text-terminal-green transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/in/shubhsoni" target="_blank" rel="noreferrer" className="text-terminal-dim hover:text-terminal-green transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="mailto:sonishubh2004@gmail.com" className="text-terminal-dim hover:text-terminal-green transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Standard grid sizing like other sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-terminal-green flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Featured Projects
          </h2>
          
            <div className="space-y-3">
            {featuredProjects && featuredProjects.length > 0 ? (
              featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassContainer variant="card" className="p-3 md:p-4 hover:shadow-glow-green transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-terminal-text mb-2 text-sm md:text-base">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mb-2 md:mb-3">
                          {project.tech_stack && project.tech_stack.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-0.5 text-[10px] md:text-xs bg-terminal-green bg-opacity-20 text-terminal-green rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="text-terminal-dim hover:text-terminal-green transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button className="text-terminal-dim hover:text-terminal-green transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </GlassContainer>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-terminal-dim py-8">
                <p>No featured projects available</p>
              </div>
            )}
          </div>
          
            <div className="text-center">
              <button
                onClick={() => onSectionChange('projects')}
                className="text-terminal-green hover:text-terminal-text transition-colors font-mono"
              >
                View All Projects →
              </button>
            </div>
            {/* Terminal Tips moved here */}
            <GlassContainer variant="card" className="p-4 mt-4">
              <h3 className="text-terminal-green font-semibold mb-3">Terminal Tips</h3>
              <ul className="space-y-2 text-sm text-terminal-text">
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Toggle terminal: <span className="font-mono text-terminal-green">⌘T</span>
                </li>
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Open sections:
                  <span className="ml-2 font-mono text-terminal-green">about</span>,
                  <span className="ml-2 font-mono text-terminal-green">skills</span>,
                  <span className="ml-2 font-mono text-terminal-green">projects</span>,
                  <span className="ml-2 font-mono text-terminal-green">experience</span>,
                  <span className="ml-2 font-mono text-terminal-green">contact</span>
                </li>
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Explore: <span className="font-mono text-terminal-green">ls</span> and <span className="font-mono text-terminal-green">cat about.txt</span>
                </li>
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Utilities: <span className="font-mono text-terminal-green">clear</span>, <span className="font-mono text-terminal-green">date</span>, <span className="font-mono text-terminal-green">ping example.com</span>
                </li>
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Admin mode: <span className="font-mono text-terminal-green">sudo admin</span>
                </li>
                <li>
                  <span className="text-terminal-dim mr-2">•</span>
                  Back to dashboard: <span className="font-mono text-terminal-green">dashboard</span>
                </li>
              </ul>
            </GlassContainer>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-terminal-blue flex items-center">
            <Code className="w-5 h-5 mr-2" />
            Skills
          </h2>

            <GlassContainer variant="strong" className="p-5">
            {/* Controls */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <input
                type="text"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="Search skills..."
                className="flex-1 min-w-[160px] bg-terminal-header bg-opacity-70 border border-terminal-green/30 rounded px-3 py-2 text-sm font-mono text-terminal-text placeholder-terminal-dim outline-none focus:border-terminal-green"
              />
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['all', ...categories].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${selectedCategory === cat ? 'bg-terminal-blue/20 text-terminal-blue border border-terminal-blue/40' : 'glass-card text-terminal-text hover:text-terminal-green'}`}
                  >
                    {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              <div className="ml-auto text-xs text-terminal-dim font-mono">
                {selectedSkillIds.size} selected
                {selectedSkillIds.size > 0 && (
                  <button onClick={() => setSelectedSkillIds(new Set())} className="ml-2 text-terminal-green hover:text-terminal-text">Clear</button>
                )}
              </div>
            </div>

            {/* Animated skills rows with continuous marquee inside the panel */}
            <div className="overflow-hidden rounded-md border border-white/5 bg-terminal-header/30">
              {(() => {
                const list = filteredSkills;
                const rowsCount = 4;
                const rows = Array.from({ length: rowsCount }, () => []);
                list.forEach((s, i) => rows[i % rowsCount].push(s));
                const durations = [28, 32, 26, 30];
                return (
                  <div className="py-2 space-y-2">
                    {rows.map((row, rowIndex) => (
                      <div key={`marquee-row-${rowIndex}`} className="relative overflow-hidden">
                        <div
                          className="flex whitespace-nowrap gap-2 will-change-transform"
                          style={{
                            animation: `marquee ${durations[rowIndex % durations.length]}s linear infinite`,
                            animationDirection: rowIndex % 2 === 0 ? 'normal' : 'reverse',
                          }}
                        >
                          {[...row, ...row].map((s, i) => (
                            <span
                              key={`${s.id || s.name}-${i}`}
                              className="px-3 py-1 text-xs rounded-full bg-terminal-header/70 text-terminal-text border border-white/10 hover:text-terminal-green transition-colors"
                              title={`${s.name} • ${s.category}`}
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="mt-4 text-right">
              <button 
                onClick={() => onSectionChange('skills')} 
                className="text-terminal-blue hover:text-terminal-text font-mono text-sm"
              >
                Open full skills page →
              </button>
            </div>
            </GlassContainer>

            

            {/* 75-Day Challenge */}
            <GlassContainer variant="card" className="p-4">
              <h3 className="text-terminal-green font-semibold mb-3 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2"/>75-Day Challenge
              </h3>
              <div className="space-y-2 text-sm text-terminal-text">
                <p>Daily coding practice and tool research:</p>
                <ul className="space-y-1 text-terminal-dim">
                  <li>• 2 LeetCode problems daily (NeetCode roadmap)</li>
                  <li>• Research one tool/technology daily</li>
                  <li>• Share honest opinions on LinkedIn</li>
                </ul>
                <div className="mt-3">
                  <a 
                    href="https://linkedin.com/in/shubhsoni" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-terminal-blue hover:text-terminal-green transition-colors font-mono text-xs flex items-center"
                  >
                    <Linkedin className="w-3 h-3 mr-1" />
                    Follow my progress →
                  </a>
                </div>
              </div>
            </GlassContainer>

            {/* GitHub Contributions (zero-dependency embed) */}
            <GlassContainer variant="card" className="p-4">
              <h3 className="text-terminal-green font-semibold mb-3 flex items-center">
                <Github className="w-4 h-4 mr-2"/>GitHub Contributions
              </h3>
              <div className="overflow-x-auto">
                <a href="https://github.com/shubhhh19" target="_blank" rel="noreferrer" className="inline-block">
                  <img
                    src="https://ghchart.rshah.org/0066ff/shubhhh19"
                    alt="GitHub contributions chart"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="max-w-none"
                    style={{ filter: 'drop-shadow(0 2px 12px rgba(0,102,255,0.18))' }}
                  />
                </a>
              </div>
            </GlassContainer>
        </div>
      </div>

      {/* Pro Tip removed for compactness */}
    </motion.div>
  );
};

export default DashboardView;